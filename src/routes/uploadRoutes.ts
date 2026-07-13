import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import { uploadMultiple, uploadSingle } from '../middlewares/uploadMiddleware';

const router = Router();

router.post('/single', protect, uploadSingle, (req, res) => {
  if (!req.file) return res.status(400).json({ success:false, message:'No file' });
  res.json({
    success: true,
    url: `/uploads/products/${req.file.filename}`,
    filename: req.file.filename
  });
});

router.post('/multiple', protect, uploadMultiple, (req, res) => {
  const files = req.files as Express.Multer.File[];
  res.json({
    success: true,
    files: files.map(f => ({
      url: `/uploads/products/${f.filename}`,
      filename: f.filename
    }))
  });
});

export default router;