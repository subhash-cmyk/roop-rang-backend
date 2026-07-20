import { Router } from "express";
import { getAbout, saveAbout } from "../controllers/aboutController";
import { protect, authorize } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: About
 *     description: About Page Management
 */

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Get About page content
 *     tags: [About]
 *     responses:
 *       200:
 *         description: About content fetched successfully
 */
router.get("/", getAbout);

/**
 * @swagger
 * /about:
 *   post:
 *     summary: Create About page content
 *     tags: [About]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: About content saved successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  saveAbout
);

/**
 * @swagger
 * /about:
 *   put:
 *     summary: Update About page content
 *     tags: [About]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: About content updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  saveAbout
);

export default router;