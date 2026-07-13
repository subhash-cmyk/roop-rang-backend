import { Request, Response } from 'express'
import prisma from '../config/prisma'

// GET /api/terms
export const getTerms = async (_req: Request, res: Response) => {
  try {
    const terms = await prisma.termsCondition.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    })

    return res.status(200).json({
      success: true,
      data: terms || null,
    })
  } catch (error) {
    console.error('getTerms error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch terms',
    })
  }
}

// GET /api/terms/all
export const listTerms = async (_req: Request, res: Response) => {
  try {
    const terms = await prisma.termsCondition.findMany({
      orderBy: { updatedAt: 'desc' },
    })

    return res.status(200).json({
      success: true,
      data: terms,
    })
  } catch (error) {
    console.error('listTerms error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch terms list',
    })
  }
}

// POST /api/terms
export const createTerms = async (req: Request, res: Response) => {
  try {
    const { title, slug, content, version, isActive } = req.body

    const created = await prisma.termsCondition.create({
      data: {
        title,
        slug,
        content,
        version: version || '1.0',
        isActive: isActive ?? true,
      },
    })

    return res.status(201).json({
      success: true,
      message: 'Terms created successfully',
      data: created,
    })
  } catch (error) {
    console.error('createTerms error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to create terms',
    })
  }
}

// PUT /api/terms/:id
export const updateTerms = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)
    const { title, slug, content, version, isActive } = req.body

    const updated = await prisma.termsCondition.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        version,
        isActive,
      },
    })

    return res.status(200).json({
      success: true,
      message: 'Terms updated successfully',
      data: updated,
    })
  } catch (error) {
    console.error('updateTerms error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to update terms',
    })
  }
}

// DELETE /api/terms/:id
export const deleteTerms = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id)

    await prisma.termsCondition.delete({
      where: { id },
    })

    return res.status(200).json({
      success: true,
      message: 'Terms deleted successfully',
    })
  } catch (error) {
    console.error('deleteTerms error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to delete terms',
    })
  }
}