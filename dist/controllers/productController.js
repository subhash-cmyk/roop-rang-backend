"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductBySlug = exports.getProductsByCategory = exports.getOfferProducts = exports.getNewArrivals = exports.getFeaturedProducts = exports.getProductById = exports.getProducts = void 0;
const database_1 = __importDefault(require("../config/database"));
const validation_1 = require("../utils/validation");
const slugify_1 = require("../utils/slugify");
const getProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category;
    const offerId = req.query.offerId || req.query.offer;
    const sort = req.query.sort || 'newest';
    const where = { status: 'ACTIVE' };
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { brand: { contains: search, mode: 'insensitive' } },
        ];
    }
    if (category) {
        where.category = { slug: category };
    }
    if (offerId) {
        where.offers = {
            some: {
                id: Number(offerId),
            },
        };
    }
    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc')
        orderBy = { sellingPrice: 'asc' };
    if (sort === 'price_desc')
        orderBy = { sellingPrice: 'desc' };
    if (sort === 'popular')
        orderBy = { viewCount: 'desc' };
    const [products, total] = await Promise.all([
        database_1.default.product.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                category: { select: { id: true, name: true, slug: true } },
                images: {
                    orderBy: { sortOrder: 'asc' },
                    take: 1,
                },
                offers: {
                    select: { id: true, name: true, slug: true, discount: true, discountType: true },
                },
            },
        }),
        database_1.default.product.count({ where }),
    ]);
    res.json({
        success: true,
        data: products,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await database_1.default.product.findUnique({
        where: { id },
        include: {
            category: true,
            images: { orderBy: { sortOrder: 'asc' } },
            offers: {
                select: { id: true, name: true, slug: true, discount: true, discountType: true },
            },
        },
    });
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }
    await database_1.default.product.update({
        where: { id },
        data: {
            viewCount: { increment: 1 },
        },
    });
    res.json({
        success: true,
        data: product,
    });
};
exports.getProductById = getProductById;
const getFeaturedProducts = async (_req, res) => {
    const products = await database_1.default.product.findMany({
        where: {
            isFeatured: true,
            status: 'ACTIVE',
        },
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
            images: { take: 1 },
            category: true,
            offers: { select: { id: true, name: true, slug: true, discount: true, discountType: true } },
        },
    });
    res.json({ success: true, data: products });
};
exports.getFeaturedProducts = getFeaturedProducts;
const getNewArrivals = async (_req, res) => {
    const products = await database_1.default.product.findMany({
        where: {
            isNewArrival: true,
            status: 'ACTIVE',
        },
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
            images: { take: 1 },
            category: true,
            offers: { select: { id: true, name: true, slug: true, discount: true, discountType: true } },
        },
    });
    res.json({ success: true, data: products });
};
exports.getNewArrivals = getNewArrivals;
const getOfferProducts = async (req, res) => {
    const offerId = req.query.offerId ? Number(req.query.offerId) : undefined;
    if (offerId) {
        const offer = await database_1.default.offer.findUnique({
            where: { id: offerId },
            include: {
                products: {
                    where: { status: 'ACTIVE' },
                    take: 8,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        images: { take: 1 },
                        category: true,
                        offers: { select: { id: true, name: true, slug: true, discount: true, discountType: true } },
                    },
                },
            },
        });
        if (offer && offer.products && offer.products.length > 0) {
            return res.json({ success: true, data: offer.products });
        }
    }
    const products = await database_1.default.product.findMany({
        where: {
            isOffer: true,
            status: 'ACTIVE',
        },
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: {
            images: { take: 1 },
            category: true,
            offers: { select: { id: true, name: true, slug: true, discount: true, discountType: true } },
        },
    });
    res.json({ success: true, data: products });
};
exports.getOfferProducts = getOfferProducts;
const getProductsByCategory = async (req, res) => {
    const { slug } = req.params;
    const products = await database_1.default.product.findMany({
        where: {
            category: { slug },
            status: 'ACTIVE',
        },
        include: {
            images: { take: 1 },
            category: true,
            offers: { select: { id: true, name: true, slug: true, discount: true, discountType: true } },
        },
        take: 24,
    });
    res.json({ success: true, data: products });
};
exports.getProductsByCategory = getProductsByCategory;
const getProductBySlug = async (req, res) => {
    const product = await database_1.default.product.findUnique({
        where: { slug: req.params.slug },
        include: {
            category: true,
            images: { orderBy: { sortOrder: 'asc' } },
            offers: {
                select: { id: true, name: true, slug: true, discount: true, discountType: true },
            },
        },
    });
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Not found',
        });
    }
    res.json({
        success: true,
        data: product,
    });
};
exports.getProductBySlug = getProductBySlug;
const createProduct = async (req, res) => {
    const parsed = validation_1.productSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            errors: parsed.error.errors,
        });
    }
    const data = parsed.data;
    const slug = `${(0, slugify_1.slugify)(data.name)}-${Date.now().toString().slice(-5)}`;
    const sku = data.sku || (0, slugify_1.generateSKU)(data.name);
    const product = await database_1.default.product.create({
        data: {
            ...data,
            slug,
            sku,
            categoryId: Number(data.categoryId),
            mrp: Number(data.mrp),
            sellingPrice: Number(data.sellingPrice),
            discount: data.discount ? Number(data.discount) : 0,
            stock: data.stock ? Number(data.stock) : 0,
        },
    });
    const files = req.files;
    if (files && files.length > 0) {
        await database_1.default.productImage.createMany({
            data: files.map((file, index) => ({
                productId: product.id,
                url: `/uploads/products/${file.filename}`,
                sortOrder: index,
            })),
        });
    }
    const createdProduct = await database_1.default.product.findUnique({
        where: { id: product.id },
        include: {
            category: true,
            images: { orderBy: { sortOrder: 'asc' } },
        },
    });
    res.status(201).json({
        success: true,
        data: createdProduct,
    });
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    const existing = await database_1.default.product.findUnique({
        where: { id },
        include: { images: true },
    });
    if (!existing) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }
    const data = { ...req.body };
    data.description = data.description || null;
    data.ingredients = data.ingredients || null;
    data.howToUse = data.howToUse || null;
    delete data.existingImages; // Remove existingImages from data if present
    if (data.name) {
        data.slug = `${(0, slugify_1.slugify)(data.name)}-${Date.now().toString().slice(-5)}`;
    }
    if (data.mrp !== undefined)
        data.mrp = Number(data.mrp);
    if (data.sellingPrice !== undefined)
        data.sellingPrice = Number(data.sellingPrice);
    if (data.discount !== undefined)
        data.discount = Number(data.discount);
    if (data.stock !== undefined)
        data.stock = Number(data.stock);
    let categoryUpdate = {};
    if (data.categoryId !== undefined) {
        categoryUpdate = {
            category: {
                connect: {
                    id: Number(data.categoryId)
                }
            }
        };
        delete data.categoryId;
    }
    if (typeof data.isFeatured === 'string') {
        data.isFeatured = data.isFeatured === 'true';
    }
    if (typeof data.isNewArrival === 'string') {
        data.isNewArrival = data.isNewArrival === 'true';
    }
    if (typeof data.isOffer === 'string') {
        data.isOffer = data.isOffer === 'true';
    }
    const product = await database_1.default.product.update({
        where: { id },
        data: {
            ...data,
            ...categoryUpdate,
        },
    });
    const files = req.files;
    if (files && files.length > 0) {
        await database_1.default.productImage.deleteMany({
            where: { productId: id },
        });
        await database_1.default.productImage.createMany({
            data: files.map((file, index) => ({
                productId: id,
                url: `/uploads/products/${file.filename}`,
                sortOrder: index,
            })),
        });
    }
    const updatedProduct = await database_1.default.product.findUnique({
        where: { id },
        include: {
            category: true,
            images: { orderBy: { sortOrder: 'asc' } },
        },
    });
    res.json({
        success: true,
        data: updatedProduct,
    });
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    await database_1.default.productImage.deleteMany({
        where: { productId: id },
    });
    await database_1.default.product.delete({
        where: { id },
    });
    res.json({
        success: true,
        message: 'Product deleted',
    });
};
exports.deleteProduct = deleteProduct;
