import { Router } from "express";
import * as oc from "../controllers/offerController";
import { protect } from "../middlewares/authMiddleware";
import { uploadOfferImage } from "../middlewares/uploadMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Offers
 *     description: Offer Management APIs
 */

/**
 * @swagger
 * /offers:
 *   get:
 *     summary: Get all offers
 *     tags: [Offers]
 *     responses:
 *       200:
 *         description: List of offers
 */
router.get("/", oc.getOffers);

/**
 * @swagger
 * /offers/{id}:
 *   get:
 *     summary: Get offer by ID
 *     tags: [Offers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Offer details
 *       404:
 *         description: Offer not found
 */
router.get("/:id", oc.getOfferById);

/**
 * @swagger
 * /offers:
 *   post:
 *     summary: Create new offer
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 example: Summer Sale
 *               description:
 *                 type: string
 *               discount:
 *                 type: number
 *                 example: 20
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Offer created successfully
 */
router.post("/", protect, uploadOfferImage.single("image"), oc.createOffer);

/**
 * @swagger
 * /offers/{id}:
 *   put:
 *     summary: Update offer
 *     tags: [Offers]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               discount:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Offer updated successfully
 */
router.put("/:id", protect, uploadOfferImage.single("image"), oc.updateOffer);

/**
 * @swagger
 * /offers/{id}:
 *   delete:
 *     summary: Delete offer
 *     tags: [Offers]
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
 *         description: Offer deleted successfully
 */
router.delete("/:id", protect, oc.deleteOffer);

export default router;