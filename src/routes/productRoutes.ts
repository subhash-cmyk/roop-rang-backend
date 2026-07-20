import { Router } from "express";
import * as pc from "../controllers/productController";
import { protect } from "../middlewares/authMiddleware";
import { uploadProductImages } from "../middlewares/uploadMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Product Management APIs
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products fetched successfully
 */
router.get("/", pc.getProducts);

/**
 * @swagger
 * /products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Featured products fetched successfully
 */
router.get("/featured", pc.getFeaturedProducts);

/**
 * @swagger
 * /products/new-arrivals:
 *   get:
 *     summary: Get new arrival products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: New arrivals fetched successfully
 */
router.get("/new-arrivals", pc.getNewArrivals);

/**
 * @swagger
 * /products/offers:
 *   get:
 *     summary: Get offer products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Offer products fetched successfully
 */
router.get("/offers", pc.getOfferProducts);

/**
 * @swagger
 * /products/category/{slug}:
 *   get:
 *     summary: Get products by category slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products fetched successfully
 */
router.get("/category/:slug", pc.getProductsByCategory);

/**
 * @swagger
 * /products/slug/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *       404:
 *         description: Product not found
 */
router.get("/slug/:slug", pc.getProductBySlug);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *       404:
 *         description: Product not found
 */
router.get("/:id", pc.getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - categoryId
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               mrp:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               featured:
 *                 type: boolean
 *               newArrival:
 *                 type: boolean
 *               offer:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post(
  "/",
  protect,
  uploadProductImages.array("images", 10),
  pc.createProduct
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
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
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               mrp:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               featured:
 *                 type: boolean
 *               newArrival:
 *                 type: boolean
 *               offer:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put(
  "/:id",
  protect,
  uploadProductImages.array("images", 10),
  pc.updateProduct
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
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
 *         description: Product deleted successfully
 */
router.delete("/:id", protect, pc.deleteProduct);

export default router;