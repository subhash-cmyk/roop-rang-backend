"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aboutController_1 = require("../controllers/aboutController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
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
router.get("/", aboutController_1.getAbout);
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
router.post("/", authMiddleware_1.protect, (0, authMiddleware_1.authorize)("SUPER_ADMIN"), aboutController_1.saveAbout);
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
router.put("/", authMiddleware_1.protect, (0, authMiddleware_1.authorize)("SUPER_ADMIN"), aboutController_1.saveAbout);
exports.default = router;
