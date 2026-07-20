import { Router } from "express";
import * as p from "../controllers/privacyController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Privacy Policy
 *     description: Privacy Policy Management APIs
 */

/**
 * @swagger
 * /privacy-policy:
 *   get:
 *     summary: Get active privacy policy
 *     tags: [Privacy Policy]
 *     responses:
 *       200:
 *         description: Privacy policy fetched successfully
 */
router.get("/", p.getPrivacy);

/**
 * @swagger
 * /privacy-policy/all:
 *   get:
 *     summary: Get all privacy policies
 *     tags: [Privacy Policy]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of privacy policies
 */
router.get("/all", protect, p.listPrivacy);

/**
 * @swagger
 * /privacy-policy:
 *   post:
 *     summary: Create privacy policy
 *     tags: [Privacy Policy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Privacy policy created successfully
 */
router.post("/", protect, p.createPrivacy);

/**
 * @swagger
 * /privacy-policy/{id}:
 *   put:
 *     summary: Update privacy policy
 *     tags: [Privacy Policy]
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
 *         description: Privacy policy updated successfully
 */
router.put("/:id", protect, p.updatePrivacy);

/**
 * @swagger
 * /privacy-policy/{id}:
 *   delete:
 *     summary: Delete privacy policy
 *     tags: [Privacy Policy]
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
 *         description: Privacy policy deleted successfully
 */
router.delete("/:id", protect, p.deletePrivacy);

export default router;