import { Request, Response } from 'express'
import prisma from '../config/database'
import { productSchema } from '../utils/validation'
import { slugify, generateSKU } from '../utils/slugify'

export const getProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 12
  const skip = (page - 1) * limit
  const search = (req.query.search as string) || ''
  const category = req.query.category as string
  const sort = (req.query.sort as string) || 'newest'

  const where: any = { status: 'ACTIVE' }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (category) {
    where.category = { slug: category }
  }

  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'price_asc') orderBy = { sellingPrice: 'asc' }
  if (sort === 'price_desc') orderBy = { sellingPrice: 'desc' }
  if (sort === 'popular') orderBy = { viewCount: 'desc' }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
    }),
    prisma.product.count({ where }),
  ])

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
}

export const getProductById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    })
  }

  await prisma.product.update({
    where: { id },
    data: {
      viewCount: { increment: 1 },
    },
  })

  res.json({
    success: true,
    data: product,
  })
}

export const getFeaturedProducts = async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      isFeatured: true,
      status: 'ACTIVE',
    },
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      images: { take: 1 },
      category: true,
    },
  })

  res.json({ success: true, data: products })
}

export const getNewArrivals = async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      isNewArrival: true,
      status: 'ACTIVE',
    },
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      images: { take: 1 },
      category: true,
    },
  })

  res.json({ success: true, data: products })
}

export const getOfferProducts = async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      isOffer: true,
      status: 'ACTIVE',
      discount: { gt: 0 },
    },
    take: 12,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      images: {
        orderBy: {
          sortOrder: 'asc',
        },
        take: 1,
      },
      category: true,
    },
  })

  res.json({
    success: true,
    data: products,
  })
}

export const getProductsByCategory = async (req: Request, res: Response) => {
  const { slug } = req.params

  const products = await prisma.product.findMany({
    where: {
      category: { slug },
      status: 'ACTIVE',
    },
    include: {
      images: { take: 1 },
      category: true,
    },
    take: 24,
  })

  res.json({ success: true, data: products })
}

export const getProductBySlug = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Not found',
    })
  }

  res.json({
    success: true,
    data: product,
  })
}

export const createProduct = async (req: Request, res: Response) => {
  const parsed = productSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      errors: parsed.error.errors,
    })
  }

  const data = parsed.data
  const slug = `${slugify(data.name)}-${Date.now().toString().slice(-5)}`
  const sku = data.sku || generateSKU(data.name)

  const product = await prisma.product.create({
 data: {
  ...data,
  slug,
  sku,
  categoryId: Number(data.categoryId),
  mrp: Number(data.mrp),
  sellingPrice: Number(data.sellingPrice),
  discount: data.discount ? Number(data.discount) : 0,
  stock: data.stock ? Number(data.stock) : 0,
  },
  })

  const files = req.files as Express.Multer.File[] | undefined

  if (files && files.length > 0) {
    await prisma.productImage.createMany({
      data: files.map((file, index) => ({
        productId: product.id,
        url: `/uploads/products/${file.filename}`,
        sortOrder: index,
      })),
    })
  }

  const createdProduct = await prisma.product.findUnique({
    where: { id: product.id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
    },
  })

  res.status(201).json({
    success: true,
    data: createdProduct,
  })
}

export const updateProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)

  const existing = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  })

  if (!existing) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    })
  }

  const data: any = { ...req.body }
  delete data.existingImages // Remove existingImages from data if present

  if (data.name) {
    data.slug = `${slugify(data.name)}-${Date.now().toString().slice(-5)}`
  }

  if (data.mrp !== undefined) data.mrp = Number(data.mrp)
  if (data.sellingPrice !== undefined) data.sellingPrice = Number(data.sellingPrice)
  if (data.discount !== undefined) data.discount = Number(data.discount)
  if (data.stock !== undefined) data.stock = Number(data.stock)

let categoryUpdate = {}

if (data.categoryId !== undefined) {
  categoryUpdate = {
    category: {
      connect: {
        id: Number(data.categoryId)
      }
    }
  }

  delete data.categoryId
}

  if (typeof data.isFeatured === 'string') {
    data.isFeatured = data.isFeatured === 'true'
  }
  if (typeof data.isNewArrival === 'string') {
    data.isNewArrival = data.isNewArrival === 'true'
  }
  if (typeof data.isOffer === 'string') {
    data.isOffer = data.isOffer === 'true'
  }
const product = await prisma.product.update({
  where: { id },
  data: {
    ...data,
    ...categoryUpdate
  },
})

  const files = req.files as Express.Multer.File[] | undefined

  if (files && files.length > 0) {
    await prisma.productImage.deleteMany({
      where: { productId: id },
    })

    await prisma.productImage.createMany({
      data: files.map((file, index) => ({
        productId: id,
        url: `/uploads/products/${file.filename}`,
        sortOrder: index,
      })),
    })
  }

  const updatedProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: 'asc' } },
    },
  })

  res.json({
    success: true,
    data: updatedProduct,
  })
}

export const deleteProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id)

  await prisma.productImage.deleteMany({
    where: { productId: id },
  })

  await prisma.product.delete({
    where: { id },
  })

  res.json({
    success: true,
    message: 'Product deleted',
  })
}

