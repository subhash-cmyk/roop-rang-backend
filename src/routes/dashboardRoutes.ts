import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Admin Dashboard APIs
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Returns dashboard statistics such as users, products, orders, inquiries, etc.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', protect, getDashboardStats);

export default router;