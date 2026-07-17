import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// ================= USER AUTH =================

export const registerSchema = z
  .object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// ================= PRODUCTS =================

export const productSchema = z.object({
  name: z.string().min(2).max(200),
  brand: z.string().optional(),

  description: z.string().min(10),

  // NEW
  ingredients: z.string().optional(),
  howToUse: z.string().optional(),

  shortDesc: z.string().max(300).optional(),

  mrp: z.coerce.number().positive(),
  sellingPrice: z.coerce.number().positive(),
  discount: z.coerce.number().min(0).max(100).default(0),
  stock: z.coerce.number().int().min(0).default(0),

  categoryId: z.coerce.number().int().positive(),

  sku: z.string().optional(),

  isFeatured: z.coerce.boolean().optional(),
  isNewArrival: z.coerce.boolean().optional(),
  isBestSeller: z.coerce.boolean().optional(),

  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),

  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

// ================= CATEGORY =================

export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

// ================= INQUIRY =================

export const inquirySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  mobile: z.string().min(10).max(15),
  product: z.string().optional(),
  productId: z.coerce.number().optional(),
  message: z.string().min(5).max(1000),
});

// ================= OFFERS =================

export const offerSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  discount: z.coerce.number().min(0).max(100),
  discountType: z.enum(['PERCENTAGE', 'FIXED']).optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

// ================= USERS =================

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});