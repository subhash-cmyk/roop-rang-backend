"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const database_1 = __importDefault(require("../config/database"));
const getDashboardStats = async (_req, res) => {
    const [totalProducts, totalCategories, totalOffers, totalInquiries, totalUsers, recentInquiries, recentProducts, lowStock, totalVisitors] = await Promise.all([
        database_1.default.product.count(),
        database_1.default.category.count(),
        database_1.default.offer.count({ where: { status: 'ACTIVE' } }),
        database_1.default.inquiry.count(),
        database_1.default.user.count(),
        database_1.default.inquiry.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
        database_1.default.product.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { images: { take: 1 } } }),
        database_1.default.product.count({ where: { stock: { lt: 5 } } }),
        database_1.default.visitor.count()
    ]);
    res.json({ success: true, data: { cards: { totalProducts, totalCategories, totalOffers, totalInquiries, totalUsers, visitors: totalVisitors, lowStock }, recentInquiries, recentProducts } });
};
exports.getDashboardStats = getDashboardStats;
