import express from 'express';
import { getCart, addToCart, updateCartQuantity, removeFromCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All cart actions require authentication

router.route('/')
  .get(getCart)
  .post(addToCart)
  .put(updateCartQuantity);

router.route('/:productId')
  .delete(removeFromCart);

export default router;
