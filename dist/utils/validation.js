"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.offerSchema = exports.inquirySchema = exports.categorySchema = exports.productSchema = exports.userLoginSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
// ================= USER AUTH =================
exports.registerSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
    password: zod_1.z.string().min(6).max(100),
    confirmPassword: zod_1.z.string().min(6).max(100),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
// ================= PRODUCTS =================
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(200),
    brand: zod_1.z.string().optional(),
    description: zod_1.z.string().min(10),
    // NEW
    ingredients: zod_1.z.string().optional(),
    howToUse: zod_1.z.string().optional(),
    shortDesc: zod_1.z.string().max(300).optional(),
    mrp: zod_1.z.coerce.number().positive(),
    sellingPrice: zod_1.z.coerce.number().positive(),
    discount: zod_1.z.coerce.number().min(0).max(100).default(0),
    stock: zod_1.z.coerce.number().int().min(0).default(0),
    categoryId: zod_1.z.coerce.number().int().positive(),
    sku: zod_1.z.string().optional(),
    isFeatured: zod_1.z.coerce.boolean().optional(),
    isNewArrival: zod_1.z.coerce.boolean().optional(),
    isBestSeller: zod_1.z.coerce.boolean().optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
    seoTitle: zod_1.z.string().optional(),
    seoDescription: zod_1.z.string().optional(),
});
// ================= CATEGORY =================
exports.categorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
// ================= INQUIRY =================
exports.inquirySchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    email: zod_1.z.string().email(),
    mobile: zod_1.z.string().min(10).max(15),
    product: zod_1.z.string().optional(),
    productId: zod_1.z.coerce.number().optional(),
    message: zod_1.z.string().min(5).max(1000),
});
// ================= OFFERS =================
exports.offerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().optional(),
    discount: zod_1.z.coerce.number().min(0).max(100),
    discountType: zod_1.z.enum(['PERCENTAGE', 'FIXED']).optional(),
    startDate: zod_1.z.string().or(zod_1.z.date()),
    endDate: zod_1.z.string().or(zod_1.z.date()),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
    productIds: zod_1.z.preprocess((val) => {
        if (typeof val === 'string') {
            try {
                const parsed = JSON.parse(val);
                if (Array.isArray(parsed))
                    return parsed.map(Number).filter(n => !isNaN(n));
            }
            catch (e) {
                if (val.trim() === '')
                    return [];
                return val.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n));
            }
        }
        if (Array.isArray(val)) {
            return val.map(Number).filter(n => !isNaN(n));
        }
        return val;
    }, zod_1.z.array(zod_1.z.number().int().positive()).optional().default([])),
});
// ================= USERS =================
exports.userSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
