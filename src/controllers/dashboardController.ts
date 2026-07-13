import { Request, Response } from 'express';
import prisma from '../config/database';
export const getDashboardStats = async (_req: Request, res: Response) => {
  const [ totalProducts, totalCategories, totalOffers, totalInquiries, totalUsers, recentInquiries, recentProducts, lowStock ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.offer.count({ where:{ status:'ACTIVE'}}),
    prisma.inquiry.count(),
    prisma.user.count(),
    prisma.inquiry.findMany({ take:5, orderBy:{ createdAt:'desc'}}),
    prisma.product.findMany({ take:5, orderBy:{ createdAt:'desc'}, include:{ images:{ take:1 }}}),
    prisma.product.count({ where:{ stock:{ lt:5 }}})
  ]);
  res.json({ success:true, data:{ cards:{ totalProducts, totalCategories, totalOffers, totalInquiries, totalUsers, visitors:12483, lowStock }, recentInquiries, recentProducts }});
};
