import { Router } from "express";
import {
  createInquiry,
  getInquiries,
  getInquiryById,
  deleteInquiry,
  updateInquiryStatus,
  exportInquiriesCSV
} from "../controllers/inquiryController";

const router = Router();

router.post("/", createInquiry);

router.get("/", getInquiries);

router.get("/:id", getInquiryById);

router.delete("/:id", deleteInquiry);

router.put("/:id", updateInquiryStatus);

router.get("/export/csv", exportInquiriesCSV);

export default router;