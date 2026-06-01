import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  addProductReview 
} from '../controllers/productController.js';
import { protect, isAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, isAdmin, upload.array('images', 5), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, isAdmin, upload.array('images', 5), updateProduct)
  .delete(protect, isAdmin, deleteProduct);

router.route('/:id/review')
  .post(protect, addProductReview);

export default router;
