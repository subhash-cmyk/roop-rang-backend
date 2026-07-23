"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = exports.uploadHeroImage = exports.uploadOfferImage = exports.uploadCategoryImage = exports.uploadProductImages = exports.uploadTestimonialImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const productsDir = path_1.default.join(process.cwd(), 'uploads/products');
const categoriesDir = path_1.default.join(process.cwd(), 'uploads/categories');
const offersDir = path_1.default.join(process.cwd(), 'uploads/offers');
const heroDir = path_1.default.join(process.cwd(), 'uploads/hero');
const testimonialsDir = path_1.default.join(process.cwd(), 'uploads/testimonials');
for (const dir of [productsDir, categoriesDir, offersDir, heroDir, testimonialsDir]) {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
}
const makeStorage = (folder) => multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, folder),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const base = path_1.default
            .basename(file.originalname, ext)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-');
        cb(null, `${Date.now()}-${base}${ext}`);
    },
});
const fileFilter = (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only jpg, jpeg, png and webp files are allowed'));
    }
};
const productUpload = (0, multer_1.default)({
    storage: makeStorage(productsDir),
    fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15 MB
        files: 10,
    },
});
const categoryUpload = (0, multer_1.default)({
    storage: makeStorage(categoriesDir),
    fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15 MB
        files: 1,
    },
});
const offerUpload = (0, multer_1.default)({
    storage: makeStorage(offersDir),
    fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15 MB
        files: 1,
    },
});
const heroUpload = (0, multer_1.default)({
    storage: makeStorage(heroDir),
    fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15 MB
        files: 1,
    },
});
const testimonialUpload = (0, multer_1.default)({
    storage: makeStorage(testimonialsDir),
    fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024,
        files: 1,
    },
});
exports.uploadTestimonialImage = testimonialUpload;
// product page ke liye
exports.uploadProductImages = productUpload;
// category page ke liye
exports.uploadCategoryImage = categoryUpload;
// offer page ke liye
exports.uploadOfferImage = offerUpload;
// hero page ke liye
exports.uploadHeroImage = heroUpload;
// uploadRoutes.ts ke liye generic exports
exports.uploadSingle = productUpload.single('image');
exports.uploadMultiple = productUpload.array('images', 10);
