"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportInquiriesCSV = exports.updateInquiryStatus = exports.deleteInquiry = exports.getInquiryById = exports.getInquiries = exports.createInquiry = void 0;
const database_1 = __importDefault(require("../config/database"));
const validation_1 = require("../utils/validation");
// Create Inquiry
const createInquiry = async (req, res) => {
    const parsed = validation_1.inquirySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            errors: parsed.error.errors,
        });
    }
    const inquiry = await database_1.default.inquiry.create({
        data: parsed.data,
    });
    res.status(201).json({
        success: true,
        message: "Inquiry submitted successfully. We will contact you soon!",
        data: inquiry,
    });
};
exports.createInquiry = createInquiry;
// Get All Inquiries With Pagination & Search
const getInquiries = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const where = search
        ? {
            OR: [
                {
                    name: {
                        contains: search,
                    },
                },
                {
                    email: {
                        contains: search,
                    },
                },
                {
                    mobile: {
                        contains: search,
                    },
                },
            ],
        }
        : {};
    const [data, total] = await Promise.all([
        database_1.default.inquiry.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
            skip: (page - 1) * limit,
            take: limit,
        }),
        database_1.default.inquiry.count({
            where,
        }),
    ]);
    res.json({
        success: true,
        data,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
};
exports.getInquiries = getInquiries;
// Get Single Inquiry
const getInquiryById = async (req, res) => {
    const inquiry = await database_1.default.inquiry.findUnique({
        where: {
            id: parseInt(req.params.id),
        },
    });
    if (!inquiry) {
        return res.status(404).json({
            success: false,
            message: "Not found",
        });
    }
    res.json({
        success: true,
        data: inquiry,
    });
};
exports.getInquiryById = getInquiryById;
// Delete Inquiry
const deleteInquiry = async (req, res) => {
    await database_1.default.inquiry.delete({
        where: {
            id: parseInt(req.params.id),
        },
    });
    res.json({
        success: true,
        message: "Deleted",
    });
};
exports.deleteInquiry = deleteInquiry;
// Update Inquiry Status
const updateInquiryStatus = async (req, res) => {
    const { status, replied, reply } = req.body;
    const inquiry = await database_1.default.inquiry.update({
        where: {
            id: parseInt(req.params.id),
        },
        data: {
            status,
            replied,
            reply,
        },
    });
    res.json({
        success: true,
        data: inquiry,
    });
};
exports.updateInquiryStatus = updateInquiryStatus;
// Export CSV
const exportInquiriesCSV = async (_req, res) => {
    const inquiries = await database_1.default.inquiry.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    const header = "ID,Name,Email,Mobile,Product,Message,Status,Date\n";
    const rows = inquiries
        .map((i) => `${i.id},"${i.name}",${i.email},${i.mobile},"${i.product || ""}","${i.message.replace(/"/g, '""')}",${i.status},${i.createdAt.toISOString()}`)
        .join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=inquiries.csv");
    res.send(header + rows);
};
exports.exportInquiriesCSV = exportInquiriesCSV;
