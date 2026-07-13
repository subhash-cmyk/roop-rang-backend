import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { protect } from '../middlewares/authMiddleware';
const router = Router();
router.get('/', getSettings);
router.put('/', protect, updateSettings);
export default router;
