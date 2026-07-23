"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.updateTestimonial = exports.createTestimonial = exports.getTestimonial = exports.getTestimonials = void 0;
const database_1 = __importDefault(require("../config/database"));
// Get All Testimonials
const getTestimonials = async (req, res) => {
    try {
        const testimonials = await database_1.default.testimonial.findMany({
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
    }
    catch (error) {
        console.log("TESTIMONIALS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch testimonials.",
        });
    }
};
exports.getTestimonials = getTestimonials;
// Get Single Testimonial
const getTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const testimonial = await database_1.default.testimonial.findUnique({
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
    }
    catch (error) {
        console.log("TESTIMONIAL ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch testimonial.",
        });
    }
};
exports.getTestimonial = getTestimonial;
// Create Testimonial
const createTestimonial = async (req, res) => {
    try {
        const { review, rating, isActive, } = req.body;
        // Get uploaded image
        const image = req.file
            ? `/uploads/testimonials/${req.file.filename}`
            : null;
        const testimonial = await database_1.default.testimonial.create({
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
    }
    catch (error) {
        console.log("CREATE TESTIMONIAL ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create testimonial.",
        });
    }
};
exports.createTestimonial = createTestimonial;
// Update Testimonial
const updateTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const { review, rating, isActive, } = req.body;
        const testimonial = await database_1.default.testimonial.update({
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
    }
    catch (error) {
        console.log("UPDATE TESTIMONIAL ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update testimonial.",
        });
    }
};
exports.updateTestimonial = updateTestimonial;
// Delete Testimonial
const deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.testimonial.delete({
            where: {
                id: parseInt(id),
            },
        });
        return res.status(200).json({
            success: true,
            message: "Testimonial deleted successfully.",
        });
    }
    catch (error) {
        console.log("DELETE TESTIMONIAL ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete testimonial.",
        });
    }
};
exports.deleteTestimonial = deleteTestimonial;
