import { Router } from "express";
import { uploadHeroImage } from "../middlewares/uploadMiddleware";

const router = Router();

router.post(
  "/",
  uploadHeroImage.single("image"),
  (req,res)=>{

    if(!req.file){
      return res.status(400).json({
        message:"Image required"
      });
    }

    res.json({
      url:`/uploads/hero/${req.file.filename}`
    });

  }
);

export default router;