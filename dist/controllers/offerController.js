"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOffer = exports.updateOffer = exports.createOffer = exports.getOfferById = exports.getOffers = void 0;
const database_1 = __importDefault(require("../config/database"));
const validation_1 = require("../utils/validation");
const slugify_1 = require("../utils/slugify");
// ================= GET OFFERS (Pagination + Search) =================
const getOffers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const where = {};
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
        database_1.default.offer.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                products: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        }),
        database_1.default.offer.count({ where }),
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
exports.getOffers = getOffers;
// ================= GET SINGLE OFFER =================
const getOfferById = async (req, res) => {
    const offer = await database_1.default.offer.findUnique({
        where: {
            id: Number(req.params.id),
        },
        include: {
            products: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
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
exports.getOfferById = getOfferById;
// ================= CREATE OFFER =================
const createOffer = async (req, res) => {
    const bannerImage = req.file
        ? `/uploads/offers/${req.file.filename}`
        : req.body.bannerImage;
    const parsed = validation_1.offerSchema.safeParse({
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
    const slug = (0, slugify_1.slugify)(data.name) + "-" + Date.now().toString().slice(-4);
    const productIds = Array.from(new Set(data.productIds || []));
    const offer = await database_1.default.offer.create({
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
            ...(productIds.length > 0 && {
                products: {
                    connect: productIds.map((id) => ({ id })),
                },
            }),
        },
        include: {
            products: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });
    res.status(201).json({
        success: true,
        data: offer,
    });
};
exports.createOffer = createOffer;
// ================= UPDATE OFFER =================
const updateOffer = async (req, res) => {
    const data = {
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
    let productIds;
    if (data.productIds !== undefined) {
        let raw = data.productIds;
        if (typeof raw === "string") {
            try {
                raw = JSON.parse(raw);
            }
            catch (e) {
                raw = raw.split(",").map((n) => Number(n.trim()));
            }
        }
        if (Array.isArray(raw)) {
            productIds = Array.from(new Set(raw.map(Number).filter((n) => !isNaN(n) && n > 0)));
        }
        delete data.productIds;
    }
    if (productIds !== undefined) {
        data.products = {
            set: productIds.map((id) => ({ id })),
        };
    }
    const offer = await database_1.default.offer.update({
        where: {
            id: Number(req.params.id),
        },
        data,
        include: {
            products: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });
    res.json({
        success: true,
        data: offer,
    });
};
exports.updateOffer = updateOffer;
// ================= DELETE OFFER =================
const deleteOffer = async (req, res) => {
    await database_1.default.offer.delete({
        where: {
            id: Number(req.params.id),
        },
    });
    res.json({
        success: true,
        message: "Offer deleted successfully",
    });
};
exports.deleteOffer = deleteOffer;
