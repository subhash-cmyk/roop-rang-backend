"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testimonialController_1 = require("../controllers/testimonialController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   - name: Testimonials
 *     description: Testimonial Management
 */
/**
 * @swagger
 * /testimonials:
 *   get:
 *     summary: Get all active testimonials
 *     tags: [Testimonials]
 *     responses:
 *       200:
 *         description: Testimonials fetched successfully
 */
router.get("/", testimonialController_1.getTestimonials);
/**
 * @swagger
 * /testimonials/{id}:
 *   get:
 *     summary: Get single testimonial
 *     tags: [Testimonials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Testimonial fetched successfully
 *       404:
 *         description: Testimonial not found
 */
router.get("/:id", testimonialController_1.getTestimonial);
/**
 * @swagger
 * /testimonials:
 *   post:
 *     summary: Create new testimonial
 *     tags: [Testimonials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               designation:
 *                 type: string
 *               city:
 *                 type: string
 *               review:
 *                 type: string
 *               rating:
 *                 type: integer
 *               image:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               displayOrder:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Testimonial created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware_1.protect, (0, authMiddleware_1.authorize)("SUPER_ADMIN"), uploadMiddleware_1.uploadTestimonialImage.single("image"), testimonialController_1.createTestimonial);
router.put("/:id", authMiddleware_1.protect, (0, authMiddleware_1.authorize)("SUPER_ADMIN"), uploadMiddleware_1.uploadTestimonialImage.single("image"), testimonialController_1.updateTestimonial);
/**
 * @swagger
 * /testimonials/{id}:
 *   put:
 *     summary: Update testimonial
 *     tags: [Testimonials]
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
 *     responses:
 *       200:
 *         description: Testimonial updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Testimonial not found
 */
router.put("/:id", authMiddleware_1.protect, (0, authMiddleware_1.authorize)("SUPER_ADMIN"), testimonialController_1.updateTestimonial);
/**
 * @swagger
 * /testimonials/{id}:
 *   delete:
 *     summary: Delete testimonial
 *     tags: [Testimonials]
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
 *         description: Testimonial deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Testimonial not found
 */
router.delete("/:id", authMiddleware_1.protect, (0, authMiddleware_1.authorize)("SUPER_ADMIN"), testimonialController_1.deleteTestimonial);
exports.default = router;
