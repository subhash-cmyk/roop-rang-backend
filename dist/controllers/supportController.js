"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
import { Request, Response } from 'express';
import prisma from '../config/database';
const genTicket = () => 'RR-' + Date.now().toString().slice(-6) + Math.floor(Math.random()*900+100);
export const createTicket = async (req: Request, res: Response) => {
  const ticket = await prisma.supportTicket.create({ data:{ ...req.body, ticketNo: genTicket() }});
  res.status(201).json({ success:true, data:ticket });
};
export const getTickets = async (_req: Request, res: Response) => {
  const data = await prisma.supportTicket.findMany({ orderBy:{ createdAt:'desc'}});
  res.json({ success:true, data });
};
export const updateTicket = async (req: Request, res: Response) => {
  const ticket = await prisma.supportTicket.update({ where:{ id: parseInt(req.params.id)}, data: req.body });
  res.json({ success:true, data:ticket });
};
export const deleteTicket = async (req: Request, res: Response) => {
  await prisma.supportTicket.delete({ where:{ id: parseInt(req.params.id)}});
  res.json({ success:true, message:'Deleted'});
};
*/ 
