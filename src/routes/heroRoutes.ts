import { Router } from "express";
import { getHero, updateHero, deleteHero } from "../controllers/heroController";

const router = Router();

router.get("/", getHero);
router.put("/", updateHero);
router.delete("/", deleteHero);

export default router;