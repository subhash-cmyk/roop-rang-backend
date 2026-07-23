"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const p = __importStar(require("../controllers/privacyController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
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
router.get("/all", authMiddleware_1.protect, p.listPrivacy);
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
router.post("/", authMiddleware_1.protect, p.createPrivacy);
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
router.put("/:id", authMiddleware_1.protect, p.updatePrivacy);
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
router.delete("/:id", authMiddleware_1.protect, p.deletePrivacy);
exports.default = router;
