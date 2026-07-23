"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inquiryController_1 = require("../controllers/inquiryController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   - name: Inquiry
 *     description: Customer Inquiry Management APIs
 */
/**
 * @swagger
 * /inquiry:
 *   post:
 *     summary: Create a new inquiry
 *     tags: [Inquiry]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rahul Sharma
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               email:
 *                 type: string
 *                 example: rahul@example.com
 *               message:
 *                 type: string
 *                 example: I want information about your products.
 *     responses:
 *       201:
 *         description: Inquiry created successfully
 */
router.post("/", inquiryController_1.createInquiry);
/**
 * @swagger
 * /inquiry:
 *   get:
 *     summary: Get all inquiries
 *     tags: [Inquiry]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of inquiries
 */
router.get("/", inquiryController_1.getInquiries);
/**
 * @swagger
 * /inquiry/{id}:
 *   get:
 *     summary: Get inquiry by ID
 *     tags: [Inquiry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inquiry details
 *       404:
 *         description: Inquiry not found
 */
router.get("/:id", inquiryController_1.getInquiryById);
/**
 * @swagger
 * /inquiry/{id}:
 *   put:
 *     summary: Update inquiry status
 *     tags: [Inquiry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: RESOLVED
 *     responses:
 *       200:
 *         description: Inquiry updated successfully
 */
router.put("/:id", inquiryController_1.updateInquiryStatus);
/**
 * @swagger
 * /inquiry/{id}:
 *   delete:
 *     summary: Delete inquiry
 *     tags: [Inquiry]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inquiry deleted successfully
 */
router.delete("/:id", inquiryController_1.deleteInquiry);
/**
 * @swagger
 * /inquiry/export/csv:
 *   get:
 *     summary: Export inquiries to CSV
 *     tags: [Inquiry]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV exported successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get("/export/csv", inquiryController_1.exportInquiriesCSV);
exports.default = router;
