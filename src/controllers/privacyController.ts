import { Request, Response } from 'express';
import prisma from '../config/database';
import { slugify } from '../utils/slugify';
export const getPrivacy = async (_req: Request, res: Response) => {
  const data = await prisma.privacyPolicy.findFirst({ where:{ isActive:true }, orderBy:{ updatedAt:'desc'}});
  res.json({ success:true, data });
};
export const listPrivacy = async (_req: Request, res: Response) => {
  const data = await prisma.privacyPolicy.findMany({ orderBy:{ createdAt:'desc'}});
  res.json({ success:true, data });
};
export const createPrivacy = async (req: Request, res: Response) => {
  const { title, content, version } = req.body;
  const policy = await prisma.privacyPolicy.create({ data:{ title, content, version: version||'1.0', slug: slugify(title)+'-'+Date.now(), isActive:true }});
  res.status(201).json({ success:true, data:policy });
};
export const updatePrivacy = async (req: Request, res: Response) => {
  const policy = await prisma.privacyPolicy.update({ where:{ id: parseInt(req.params.id)}, data:req.body });
  res.json({ success:true, data:policy });
};
export const deletePrivacy = async (req: Request, res: Response) => {
  await prisma.privacyPolicy.delete({ where:{ id: parseInt(req.params.id)}});
  res.json({ success:true, message:'Deleted'});
};
