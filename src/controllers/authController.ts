import { Request, Response } from 'express';
import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { loginSchema } from '../utils/validation';
import { AuthRequest } from '../middlewares/authMiddleware';
export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, errors: parsed.error.errors });
  const { email, password } = parsed.data;
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !admin.isActive) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const token = generateToken({ id: admin.id, email: admin.email, role: admin.role });
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7*24*60*60*1000 });
  res.json({ success: true, token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }});
};
export const logout = async (_req: Request, res: Response) => { res.clearCookie('token'); res.json({ success: true, message: 'Logged out' }); };
export const getProfile = async (req: AuthRequest, res: Response) => {
  const admin = await prisma.admin.findUnique({ where: { id: req.admin!.id }, select: { id:true, name:true, email:true, role:true, avatar:true, createdAt:true }});
  res.json({ success: true, data: admin });
};
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { name, email, avatar } = req.body;
  const updated = await prisma.admin.update({ where: { id: req.admin!.id }, data: { name, email, avatar }});
  res.json({ success: true, data: updated });
};
export const changePassword = async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await prisma.admin.findUnique({ where: { id: req.admin!.id }});
  if (!admin) return res.status(404).json({ success:false, message:'Not found'});
  const match = await bcrypt.compare(currentPassword, admin.password);
  if (!match) return res.status(400).json({ success:false, message:'Current password incorrect'});
  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.admin.update({ where:{ id: admin.id }, data:{ password: hashed }});
  res.json({ success:true, message:'Password changed' });
};
