import { Request, Response } from 'express'
import prisma from '../config/database'
import { categorySchema } from '../utils/validation'
import { slugify } from '../utils/slugify'

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  })
  res.json({ success: true, data: categories })
}

export const getCategoryById = async (req: Request, res: Response) => {
  const category = await prisma.category.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      products: {
        take: 12,
        where: { status: 'ACTIVE' },
        include: { images: { take: 1 } },
      },
    },
  })

  if (!category) {
    return res.status(404).json({ success: false, message: 'Not found' })
  }

  res.json({ success: true, data: category })
}

export const createCategory = async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File | undefined
  const image = file?.filename
    ? `/uploads/categories/${file.filename}`
    : req.body.image

  const parsed = categorySchema.safeParse({
    ...req.body,
    image,
  })

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.errors,
    })
  }

  const { name, description, status } = parsed.data
  const slug = slugify(name)

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      status: status || 'ACTIVE',
      image,
    },
  })

  res.status(201).json({ success: true, data: category })
}

export const updateCategory = async (req: Request, res: Response) => {
  const data: any = { ...req.body }

  if (data.name) {
    data.slug = slugify(data.name)
  }

  if (req.file) {
    data.image = `/uploads/categories/${req.file.filename}`
  }

  const category = await prisma.category.update({
    where: { id: parseInt(req.params.id) },
    data,
  })

  res.json({ success: true, data: category })
}

export const deleteCategory = async (req: Request, res: Response) => {
  await prisma.category.delete({
    where: { id: parseInt(req.params.id) },
  })

  res.json({ success: true, message: 'Deleted' })
}

export const adminListCategories = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = 20

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.count(),
  ])

  res.json({
    success: true,
    data,
    pagination: {
      page,
      total,
      pages: Math.ceil(total / limit),
    },
  })
}