import { Request, Response } from "express";
import prisma from "../config/database";

// Get About Page
export const getAbout = async (req: Request, res: Response) => {
  try {
    const about = await prisma.about.findFirst({
      orderBy: { id: "asc" },
    });

    return res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.log("ABOUT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch About page.",
    });
  }
};

// Create / Update About Page
export const saveAbout = async (req: Request, res: Response) => {
  try {
    const {
      title,
      tagline,
      story,
      mission,
      vision,
      address,
      phone,
      email,
      whatsapp,
      image,
    } = req.body;

    const existing = await prisma.about.findFirst();

    let about;

    if (existing) {
      about = await prisma.about.update({
        where: {
          id: existing.id,
        },
        data: {
          title,
          tagline,
          story,
          mission,
          vision,
          address,
          phone,
          email,
          whatsapp,
          image,
        },
      });
    } else {
      about = await prisma.about.create({
        data: {
          title,
          tagline,
          story,
          mission,
          vision,
          address,
          phone,
          email,
          whatsapp,
          image,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "About page updated successfully.",
      data: about,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save About page.",
    });
  }
};