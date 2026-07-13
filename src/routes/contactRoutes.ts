import { Router } from 'express';
import * as c from '../controllers/contactController';
import { protect } from '../middlewares/authMiddleware';
const router = Router();
router.post('/', c.createContact);
router.get('/', protect, c.getContacts);
router.delete('/:id', protect, c.deleteContact);
export default router;
