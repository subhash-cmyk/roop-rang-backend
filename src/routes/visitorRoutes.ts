import { Router } from "express";
import {
 addVisitor,
 getVisitors
} from "../controllers/visitorController";


const router = Router();


router.post("/", addVisitor);

router.get("/", getVisitors);


export default router;