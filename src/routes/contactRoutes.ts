import { Router } from 'express';
import * as c from '../controllers/contactController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Contact
 *     description: Contact / Customer Inquiry APIs
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit contact inquiry
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               subject:
 *                 type: string
 *                 example: Product Inquiry
 *               message:
 *                 type: string
 *                 example: I want more details about your products.
 *     responses:
 *       201:
 *         description: Contact inquiry submitted successfully
 */
router.post('/', c.createContact);

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Get all contact inquiries
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contact inquiries fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, c.getContacts);

/**
 * @swagger
 * /contact/{id}:
 *   delete:
 *     summary: Delete contact inquiry
 *     tags: [Contact]
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
 *         description: Contact inquiry deleted successfully
 *       404:
 *         description: Contact inquiry not found
 */
router.delete('/:id', protect, c.deleteContact);

export default router;