import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
export interface AuthRequest extends Request { admin?: { id:number; email:string; role:string } }
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;
  if (req.headers.authorization?.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
  else if (req.cookies?.token) token = req.cookies.token;
  if (!token) return res.status(401).json({ success:false, message:'Not authorized, token missing' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const admin = await prisma.admin.findUnique({ where:{ id: decoded.id }});
    if (!admin || !admin.isActive) return res.status(401).json({ success:false, message:'Admin not found' });
    req.admin = { id: admin.id, email: admin.email, role: admin.role };
    next();
  } catch (e) { return res.status(401).json({ success:false, message:'Token invalid' }); }
};
export const authorize = (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.admin || !roles.includes(req.admin.role)) return res.status(403).json({ success:false, message:'Forbidden' });
  next();
};
