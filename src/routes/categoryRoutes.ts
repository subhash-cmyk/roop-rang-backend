import { Router } from "express";
import multer from "multer";

import {
  adminListCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";

const router = Router();

// Multer
const upload = multer({
  dest: "uploads/categories",
});

// ================= Public =================

// Pagination + Search (Admin List)
router.get("/", adminListCategories);

// Category by ID
router.get("/:id", getCategoryById);

// ================= Admin =================

// Create
router.post("/", upload.single("image"), createCategory);

// Update
router.put("/:id", upload.single("image"), updateCategory);

// Delete
router.delete("/:id", deleteCategory);

export default router;