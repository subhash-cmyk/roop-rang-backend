import { Router } from "express";
import {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController";
import { protect, authorize } from "../middlewares/authMiddleware";
import { uploadTestimonialImage } from "../middlewares/uploadMiddleware";

const router = Router();

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
router.get("/", getTestimonials);

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
router.get("/:id", getTestimonial);

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
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  uploadTestimonialImage.single("image"),
  createTestimonial
);

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  uploadTestimonialImage.single("image"),
  updateTestimonial
);

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
router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  updateTestimonial
);

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
router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  deleteTestimonial
);

export default router;
