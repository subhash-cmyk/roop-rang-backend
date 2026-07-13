import { Request, Response, NextFunction } from 'express';
export const notFound = (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ success:false, message:`Route not found - ${req.originalUrl}` });
};
export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(err);
  if (err.code === 'P2002') return res.status(400).json({ success:false, message:'Duplicate entry' });
  if (err.name === 'ZodError') return res.status(400).json({ success:false, message:'Validation failed', errors: err.errors });
  res.status(statusCode).json({ success:false, message: err.message || 'Server Error', stack: process.env.NODE_ENV==='production'?undefined:err.stack });
};
