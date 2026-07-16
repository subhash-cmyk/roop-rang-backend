import { Router } from "express";
import { getAbout, saveAbout } from "../controllers/aboutController";
import { protect, authorize } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getAbout);

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  saveAbout
);

router.put(
  "/",
  protect,
  authorize("ADMIN"),
  saveAbout
);

export default router;