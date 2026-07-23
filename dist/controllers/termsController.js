"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTerms = exports.updateTerms = exports.createTerms = exports.listTerms = exports.getTerms = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
// GET /api/terms
const getTerms = async (_req, res) => {
    try {
        const terms = await prisma_1.default.termsCondition.findFirst({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' },
        });
        return res.status(200).json({
            success: true,
            data: terms || null,
        });
    }
    catch (error) {
        console.error('getTerms error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch terms',
        });
    }
};
exports.getTerms = getTerms;
// GET /api/terms/all
const listTerms = async (_req, res) => {
    try {
        const terms = await prisma_1.default.termsCondition.findMany({
            orderBy: { updatedAt: 'desc' },
        });
        return res.status(200).json({
            success: true,
            data: terms,
        });
    }
    catch (error) {
        console.error('listTerms error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch terms list',
        });
    }
};
exports.listTerms = listTerms;
// POST /api/terms
const createTerms = async (req, res) => {
    try {
        const { title, slug, content, version, isActive } = req.body;
        const created = await prisma_1.default.termsCondition.create({
            data: {
                title,
                slug,
                content,
                version: version || '1.0',
                isActive: isActive ?? true,
            },
        });
        return res.status(201).json({
            success: true,
            message: 'Terms created successfully',
            data: created,
        });
    }
    catch (error) {
        console.error('createTerms error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create terms',
        });
    }
};
exports.createTerms = createTerms;
// PUT /api/terms/:id
const updateTerms = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, slug, content, version, isActive } = req.body;
        const updated = await prisma_1.default.termsCondition.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                version,
                isActive,
            },
        });
        return res.status(200).json({
            success: true,
            message: 'Terms updated successfully',
            data: updated,
        });
    }
    catch (error) {
        console.error('updateTerms error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update terms',
        });
    }
};
exports.updateTerms = updateTerms;
// DELETE /api/terms/:id
const deleteTerms = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma_1.default.termsCondition.delete({
            where: { id },
        });
        return res.status(200).json({
            success: true,
            message: 'Terms deleted successfully',
        });
    }
    catch (error) {
        console.error('deleteTerms error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete terms',
        });
    }
};
exports.deleteTerms = deleteTerms;
