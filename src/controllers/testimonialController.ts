import { Request, Response } from "express";
import prisma from "../config/database";

// Get All Testimonials
export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.log("TESTIMONIALS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials.",
    });
  }
};

// Get Single Testimonial
export const getTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.log("TESTIMONIAL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch testimonial.",
    });
  }
};

// Create Testimonial
export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const {
      review,
      rating,
      isActive,
    } = req.body;

    // Get uploaded image
    const image = req.file
      ? `/uploads/testimonials/${req.file.filename}`
      : null;

    const testimonial = await prisma.testimonial.create({
      data: {
        review: review?.trim() || null,
        rating: Number(rating) || 5,
        isActive: isActive === "true",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully.",
      data: testimonial,
    });
  } catch (error) {
    console.log("CREATE TESTIMONIAL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create testimonial.",
    });
  }
};

// Update Testimonial
export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      review,
      rating,
      isActive,
    } = req.body;

    const testimonial = await prisma.testimonial.update({
      where: {
        id: parseInt(id),
      },
      data: {
        review,
        rating,
        isActive,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Testimonial updated successfully.",
      data: testimonial,
    });
  } catch (error) {
    console.log("UPDATE TESTIMONIAL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update testimonial.",
    });
  }
};

// Delete Testimonial
export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.testimonial.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully.",
    });
  } catch (error) {
    console.log("DELETE TESTIMONIAL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete testimonial.",
    });
  }
};
