import { Router } from "express";
import { getAbout, saveAbout } from "../controllers/aboutController";
import { protect, authorize } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getAbout); // Public

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  saveAbout
);

router.put(
  "/",
  protect,
  authorize("SUPER_ADMIN"),
  saveAbout
);
export default router;