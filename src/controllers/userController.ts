import { Request, Response } from 'express';
import prisma from '../config/database';
import { userSchema } from '../utils/validation';
export const getUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit=20;
  const search = req.query.search as string || '';
  const where:any = search ? { OR:[ { name:{ contains: search }}, { email:{ contains: search }} ] } : {};
  const [data,total] = await Promise.all([
    prisma.user.findMany({ where, skip:(page-1)*limit, take:limit, orderBy:{ createdAt:'desc'}}),
    prisma.user.count({ where })
  ]);
  res.json({ success:true, data, pagination:{ page, total, pages: Math.ceil(total/limit)}});
};
export const getUser = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where:{ id: parseInt(req.params.id)}});
  if(!user) return res.status(404).json({success:false, message:'Not found'});
  res.json({ success:true, data:user });
};
export const createUser = async (req: Request, res: Response) => {
  const parsed = userSchema.safeParse(req.body);
  if(!parsed.success) return res.status(400).json({ success:false, errors: parsed.error.errors });
  const user = await prisma.user.create({ data: parsed.data });
  res.status(201).json({ success:true, data:user });
};
export const updateUser = async (req: Request, res: Response) => {
  const user = await prisma.user.update({ where:{ id: parseInt(req.params.id)}, data: req.body });
  res.json({ success:true, data:user });
};
export const deleteUser = async (req: Request, res: Response) => {
  await prisma.user.delete({ where:{ id: parseInt(req.params.id)}});
  res.json({ success:true, message:'Deleted'});
};
