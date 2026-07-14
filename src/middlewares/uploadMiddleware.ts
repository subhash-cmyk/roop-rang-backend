import multer from 'multer'
import path from 'path'
import fs from 'fs'

const productsDir = path.join(process.cwd(), 'uploads/products')
const categoriesDir = path.join(process.cwd(), 'uploads/categories')
const offersDir = path.join(process.cwd(), 'uploads/offers')
const heroDir = path.join(process.cwd(), 'uploads/hero')

for (const dir of [productsDir, categoriesDir, offersDir, heroDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const makeStorage = (folder: string) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, folder),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname)
      const base = path
        .basename(file.originalname, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')

      cb(null, `${Date.now()}-${base}${ext}`)
    },
  })

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only jpg, jpeg, png and webp files are allowed'))
  }
}

const productUpload = multer({
  storage: makeStorage(productsDir),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
})

const categoryUpload = multer({
  storage: makeStorage(categoriesDir),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
})

const offerUpload = multer({
  storage: makeStorage(offersDir),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
})
const heroUpload = multer({
  storage: makeStorage(heroDir),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
})


// product page ke liye
export const uploadProductImages = productUpload

// category page ke liye
export const uploadCategoryImage = categoryUpload

// offer page ke liye
export const uploadOfferImage = offerUpload
// hero page ke liye
export const uploadHeroImage = heroUpload

// uploadRoutes.ts ke liye generic exports
export const uploadSingle = productUpload.single('image')
export const uploadMultiple = productUpload.array('images', 10)