import { Router } from "express";
import { uploadHeroImage } from "../middlewares/uploadMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Upload
 *     description: File Upload APIs
 */

/**
 * @swagger
 * /upload/hero:
 *   post:
 *     summary: Upload Hero Banner Image
 *     description: Upload a hero banner image and return its URL.
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: /uploads/hero/banner-12345.jpg
 *       400:
 *         description: Image is required
 */
router.post(
  "/",
  uploadHeroImage.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "Image required",
      });
    }

    res.json({
      url: `/uploads/hero/${req.file.filename}`,
    });
  }
);

export default router;