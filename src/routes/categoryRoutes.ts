import { Router } from 'express'
import * as cc from '../controllers/categoryController'
import { protect } from '../middlewares/authMiddleware'
import { uploadCategoryImage } from '../middlewares/uploadMiddleware'

const router = Router()

router.get('/', cc.getCategories)
router.get('/:id', cc.getCategoryById)
router.post('/', protect, uploadCategoryImage.single('image'), cc.createCategory)
router.put('/:id', protect, uploadCategoryImage.single('image'), cc.updateCategory)
router.delete('/:id', protect, cc.deleteCategory)

export default router