"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
router.post('/single', authMiddleware_1.protect, uploadMiddleware_1.uploadSingle, (req, res) => {
    if (!req.file)
        return res.status(400).json({ success: false, message: 'No file' });
    res.json({
        success: true,
        url: `/uploads/products/${req.file.filename}`,
        filename: req.file.filename
    });
});
router.post('/multiple', authMiddleware_1.protect, uploadMiddleware_1.uploadMultiple, (req, res) => {
    const files = req.files;
    res.json({
        success: true,
        files: files.map(f => ({
            url: `/uploads/products/${f.filename}`,
            filename: f.filename
        }))
    });
});
exports.default = router;
