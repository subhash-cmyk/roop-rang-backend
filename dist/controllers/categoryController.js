"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.adminListCategories = exports.getCategories = void 0;
const database_1 = __importDefault(require("../config/database"));
const validation_1 = require("../utils/validation");
const slugify_1 = require("../utils/slugify");
// ================= PUBLIC CATEGORY LIST =================
const getCategories = async (_req, res) => {
    try {
        const categories = await database_1.default.category.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getCategories = getCategories;
// ================= ADMIN CATEGORY LIST (Pagination + Search) =================
const adminListCategories = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 100;
        const search = String(req.query.search || "");
        const where = {};
        if (search) {
            where.name = {
                contains: search,
            };
        }
        const [data, total] = await Promise.all([
            database_1.default.category.findMany({
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
            database_1.default.category.count({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load categories",
        });
    }
};
exports.adminListCategories = adminListCategories;
// ================= GET CATEGORY =================
const getCategoryById = async (req, res) => {
    try {
        const category = await database_1.default.category.findUnique({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to load category",
        });
    }
};
exports.getCategoryById = getCategoryById;
// ================= CREATE CATEGORY =================
const createCategory = async (req, res) => {
    try {
        const file = req.file;
        const image = file?.filename
            ? `/uploads/categories/${file.filename}`
            : req.body.image;
        const parsed = validation_1.categorySchema.safeParse({
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
        const category = await database_1.default.category.create({
            data: {
                name,
                slug: (0, slugify_1.slugify)(name),
                description,
                status: status || "ACTIVE",
                image,
            },
        });
        res.status(201).json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create category",
        });
    }
};
exports.createCategory = createCategory;
// ================= UPDATE CATEGORY =================
const updateCategory = async (req, res) => {
    try {
        const data = {
            ...req.body,
        };
        if (data.name) {
            data.slug = (0, slugify_1.slugify)(data.name);
        }
        if (req.file) {
            data.image = `/uploads/categories/${req.file.filename}`;
        }
        const category = await database_1.default.category.update({
            where: {
                id: Number(req.params.id),
            },
            data,
        });
        res.json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update category",
        });
    }
};
exports.updateCategory = updateCategory;
// ================= DELETE CATEGORY =================
const deleteCategory = async (req, res) => {
    try {
        await database_1.default.category.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        res.json({
            success: true,
            message: "Category deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete category",
        });
    }
};
exports.deleteCategory = deleteCategory;
