import { Request, Response } from 'express';
import prisma from '../config/database';
export const getSettings = async (_req: Request, res: Response) => {
  let settings = await prisma.websiteSetting.findFirst();
  if(!settings){
    settings = await prisma.websiteSetting.create({
      data:{
        businessName: 'Roop Rang',
        address: 'Shop No 521, Apex Building, Madhuram Circle, Dindoli, Surat, Gujarat – 394210',
        email: 'rangroop@gmail.com',
        phone: '+91 7096241594',
        whatsappNumber: '917096241594',
        tagline: 'Luxury Cosmetics, Timeless Beauty',
        facebook: 'https://facebook.com/rooprang',
        instagram: 'https://instagram.com/rooprang',
        youtube: '',
        twitter: '',
        googleMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721....',
        seoTitle: 'Roop Rang - Luxury Cosmetics',
        seoDescription: 'Premium cosmetic products - luxury beauty at Roop Rang Surat'
      }
    });
  }
  res.json({ success:true, data: settings });
};
export const updateSettings = async (req: Request, res: Response) => {
  const existing = await prisma.websiteSetting.findFirst();
  let settings;
  if(existing){
    settings = await prisma.websiteSetting.update({ where:{ id: existing.id }, data: req.body });
  } else {
    settings = await prisma.websiteSetting.create({ data: req.body });
  }
  res.json({ success:true, data: settings });
};
