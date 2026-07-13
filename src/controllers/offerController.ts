import { Request, Response } from 'express'
import prisma from '../config/database'
import { offerSchema } from '../utils/validation'
import { slugify } from '../utils/slugify'

export const getOffers = async (_req: Request, res: Response) => {
  const offers = await prisma.offer.findMany({
    where: {
      status: 'ACTIVE',
      endDate: { gte: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  res.json({ success: true, data: offers })
}

export const getOfferById = async (req: Request, res: Response) => {
  const offer = await prisma.offer.findUnique({
    where: { id: parseInt(req.params.id) },
  })

  if (!offer) {
    return res.status(404).json({ success: false, message: 'Not found' })
  }

  res.json({ success: true, data: offer })
}

export const createOffer = async (req: Request, res: Response) => {
  const bannerImage = req.file
    ? `/uploads/offers/${req.file.filename}`
    : req.body.bannerImage

  const parsed = offerSchema.safeParse({
    ...req.body,
    bannerImage,
  })

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.errors,
    })
  }

  const data = parsed.data
  const slug = slugify(data.name) + '-' + Date.now().toString().slice(-4)

  const offer = await prisma.offer.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      discount: data.discount,
      discountType: data.discountType || 'PERCENTAGE',
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: data.status || 'ACTIVE',
      bannerImage,
    },
  })

  res.status(201).json({ success: true, data: offer })
}

export const updateOffer = async (req: Request, res: Response) => {
  const data: any = { ...req.body }

  if (req.file) {
    data.bannerImage = `/uploads/offers/${req.file.filename}`
  }

  if (data.discount !== undefined) {
    data.discount = parseInt(data.discount, 10)
  }

  if (data.startDate) {
    data.startDate = new Date(data.startDate)
  }

  if (data.endDate) {
    data.endDate = new Date(data.endDate)
  }

  if (typeof data.status === "string") {
    data.status = data.status.toUpperCase()
  }

  const offer = await prisma.offer.update({
    where: { id: Number(req.params.id) },
    data,
  })

  res.json({ success: true, data: offer })
}

export const deleteOffer = async (req: Request, res: Response) => {
  await prisma.offer.delete({
    where: { id: parseInt(req.params.id) },
  })

  res.json({ success: true, message: 'Deleted' })
}