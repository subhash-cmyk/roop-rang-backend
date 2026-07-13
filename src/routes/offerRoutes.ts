import { Router } from 'express';
import * as oc from '../controllers/offerController';
import { protect } from '../middlewares/authMiddleware';
import { uploadOfferImage } from '../middlewares/uploadMiddleware'

const router = Router();
router.get('/', oc.getOffers);
router.get('/:id', oc.getOfferById);
router.post('/', protect, uploadOfferImage.single('image'), oc.createOffer);
router.put('/:id', protect, uploadOfferImage.single('image'), oc.updateOffer);
router.delete('/:id', protect, oc.deleteOffer);

export default router;
