import { Request, Response } from 'express';
import prisma from '../config/database';
export const createContact = async (req: Request, res: Response) => {
  const contact = await prisma.contact.create({ data: req.body });
  res.status(201).json({ success:true, data:contact, message:'Message sent!' });
};
export const getContacts = async (_req: Request, res: Response) => {
  const data = await prisma.contact.findMany({ orderBy:{ createdAt:'desc'}});
  res.json({ success:true, data });
};
export const deleteContact = async (req: Request, res: Response) => {
  await prisma.contact.delete({ where:{ id: parseInt(req.params.id)}});
  res.json({ success:true, message:'Deleted'});
};
