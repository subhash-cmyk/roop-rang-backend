import { Request, Response } from "express";
import prisma from "../config/database";
import { categorySchema } from "../utils/validation";
import { slugify } from "../utils/slugify";

// ================= PUBLIC CATEGORY LIST =================
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { status: "ACTIVE" },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= ADMIN CATEGORY LIST (Pagination + Search) =================
export const adminListCategories = async (
  req: Request,
  res: Response
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || "");

    const where: any = {};

    if (search) {
      where.name = {
        contains: search,
      };
    }

    const [data, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
      }),

      prisma.category.count({
        where,
      }),
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load categories",
    });
  }
};

// ================= GET CATEGORY =================
export const getCategoryById = async (
  req: Request,
  res: Response
) => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        products: {
          take: 12,
          where: {
            status: "ACTIVE",
          },
          include: {
            images: {
              take: 1,
            },
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load category",
    });
  }
};

// ================= CREATE CATEGORY =================
export const createCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const file = req.file as Express.Multer.File | undefined;

    const image = file?.filename
      ? `/uploads/categories/${file.filename}`
      : req.body.image;

    const parsed = categorySchema.safeParse({
      ...req.body,
      image,
    });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        errors: parsed.error.errors,
      });
    }

    const { name, description, status } = parsed.data;

    const category = await prisma.category.create({
      data: {
        name,
        slug: slugify(name),
        description,
        status: status || "ACTIVE",
        image,
      },
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

// ================= UPDATE CATEGORY =================
export const updateCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const data: any = {
      ...req.body,
    };

    if (data.name) {
      data.slug = slugify(data.name);
    }

    if (req.file) {
      data.image = `/uploads/categories/${req.file.filename}`;
    }

    const category = await prisma.category.update({
      where: {
        id: Number(req.params.id),
      },
      data,
    });

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

// ================= DELETE CATEGORY =================
export const deleteCategory = async (
  req: Request,
  res: Response
) => {
  try {
    await prisma.category.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};