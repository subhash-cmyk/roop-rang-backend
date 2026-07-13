import { Request, Response } from 'express';
import prisma from '../config/database';
import { inquirySchema } from '../utils/validation';
export const createInquiry = async (req: Request, res: Response) => {
  const parsed = inquirySchema.safeParse(req.body);
  if(!parsed.success) return res.status(400).json({ success:false, errors:parsed.error.errors });
  const inquiry = await prisma.inquiry.create({ data: parsed.data });
  res.status(201).json({ success:true, message:'Inquiry submitted successfully. We will contact you soon!', data: inquiry });
};
export const getInquiries = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = req.query.search as string || '';
  const where:any = search ? { OR:[ { name:{ contains: search }}, { email:{ contains: search }}, { mobile:{ contains: search }} ] } : {};
  const [data,total] = await Promise.all([
    prisma.inquiry.findMany({ where, orderBy:{ createdAt:'desc'}, skip:(page-1)*limit, take:limit }),
    prisma.inquiry.count({ where })
  ]);
  res.json({ success:true, data, pagination:{ page, limit, total, pages: Math.ceil(total/limit)}});
};
export const getInquiryById = async (req: Request, res: Response) => {
  const inquiry = await prisma.inquiry.findUnique({ where:{ id: parseInt(req.params.id)}});
  if(!inquiry) return res.status(404).json({ success:false, message:'Not found'});
  res.json({ success:true, data: inquiry });
};
export const deleteInquiry = async (req: Request, res: Response) => {
  await prisma.inquiry.delete({ where:{ id: parseInt(req.params.id)}});
  res.json({ success:true, message:'Deleted'});
};
export const updateInquiryStatus = async (req: Request, res: Response) => {
  const { status, replied, reply } = req.body;
  const inquiry = await prisma.inquiry.update({ where:{ id: parseInt(req.params.id)}, data:{ status, replied, reply }});
  res.json({ success:true, data: inquiry });
};
export const exportInquiriesCSV = async (_req: Request, res: Response) => {
  const inquiries = await prisma.inquiry.findMany({ orderBy:{ createdAt:'desc'}});
  const header = 'ID,Name,Email,Mobile,Product,Message,Status,Date\n';
  const rows = inquiries.map(i=> `${i.id},"${i.name}",${i.email},${i.mobile},"${i.product||''}","${i.message.replace(/"/g,'""')}",${i.status},${i.createdAt.toISOString()}`).join('\n');
  res.setHeader('Content-Type','text/csv');
  res.setHeader('Content-Disposition','attachment; filename=inquiries.csv');
  res.send(header+rows);
};
