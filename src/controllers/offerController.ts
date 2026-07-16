import { Request, Response } from "express";
import prisma from "../config/database";
import { offerSchema } from "../utils/validation";
import { slugify } from "../utils/slugify";

// ================= GET OFFERS (Pagination + Search) =================
export const getOffers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || "";

  const where: any = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.offer.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.offer.count({ where }),
  ]);

  res.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

// ================= GET SINGLE OFFER =================
export const getOfferById = async (req: Request, res: Response) => {
  const offer = await prisma.offer.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!offer) {
    return res.status(404).json({
      success: false,
      message: "Offer not found",
    });
  }

  res.json({
    success: true,
    data: offer,
  });
};

// ================= CREATE OFFER =================
export const createOffer = async (req: Request, res: Response) => {
  const bannerImage = req.file
    ? `/uploads/offers/${req.file.filename}`
    : req.body.bannerImage;

  const parsed = offerSchema.safeParse({
    ...req.body,
    bannerImage,
  });

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.errors,
    });
  }

  const data = parsed.data;

  const slug =
    slugify(data.name) + "-" + Date.now().toString().slice(-4);

  const offer = await prisma.offer.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      discount: data.discount,
      discountType: data.discountType || "PERCENTAGE",
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: data.status || "ACTIVE",
      bannerImage,
    },
  });

  res.status(201).json({
    success: true,
    data: offer,
  });
};

// ================= UPDATE OFFER =================
export const updateOffer = async (req: Request, res: Response) => {
  const data: any = {
    ...req.body,
  };

  if (req.file) {
    data.bannerImage = `/uploads/offers/${req.file.filename}`;
  }

  if (data.discount !== undefined) {
    data.discount = Number(data.discount);
  }

  if (data.startDate) {
    data.startDate = new Date(data.startDate);
  }

  if (data.endDate) {
    data.endDate = new Date(data.endDate);
  }

  if (typeof data.status === "string") {
    data.status = data.status.toUpperCase();
  }

  const offer = await prisma.offer.update({
    where: {
      id: Number(req.params.id),
    },
    data,
  });

  res.json({
    success: true,
    data: offer,
  });
};

// ================= DELETE OFFER =================
export const deleteOffer = async (req: Request, res: Response) => {
  await prisma.offer.delete({
    where: {
      id: Number(req.params.id),
    },
  });

  res.json({
    success: true,
    message: "Offer deleted successfully",
  });
};