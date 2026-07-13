import { Router } from 'express'
import * as pc from '../controllers/productController'
import { protect } from '../middlewares/authMiddleware'
import { uploadProductImages } from '../middlewares/uploadMiddleware'

const router = Router()

router.get('/', pc.getProducts)
router.get('/featured', pc.getFeaturedProducts)
router.get('/new-arrivals', pc.getNewArrivals)
router.get('/offers', pc.getOfferProducts)
router.get('/category/:slug', pc.getProductsByCategory)
router.get('/slug/:slug', pc.getProductBySlug)
router.get('/:id', pc.getProductById)

router.post(
  '/',
  protect,
  uploadProductImages.array('images', 10),
  pc.createProduct
)

router.put(
  '/:id',
  protect,
  uploadProductImages.array('images', 10),
  pc.updateProduct
)

router.delete('/:id', protect, pc.deleteProduct)

export default router