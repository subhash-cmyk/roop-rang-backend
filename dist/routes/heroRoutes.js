"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const heroController_1 = require("../controllers/heroController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   - name: Hero Banner
 *     description: Home Page Hero Banner Management
 */
/**
 * @swagger
 * /hero:
 *   get:
 *     summary: Get hero banner details
 *     description: Returns the current hero banner information for the website.
 *     tags: [Hero Banner]
 *     responses:
 *       200:
 *         description: Hero banner fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Internal server error
 */
router.get("/", heroController_1.getHero);
/**
 * @swagger
 * /hero:
 *   put:
 *     summary: Update hero banner
 *     description: Update the homepage hero banner details.
 *     tags: [Hero Banner]
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
 *         description: Hero banner updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.put("/", heroController_1.updateHero);
exports.default = router;
