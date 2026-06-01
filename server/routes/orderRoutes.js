import express from 'express';
import { 
  placeOrder, 
  createRazorpayOrder, 
  verifyRazorpayPayment, 
  getMyOrders, 
  getOrderById, 
  getAdminOrders, 
  updateOrderStatus 
} from '../controllers/orderController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All order actions require authentication

router.route('/')
  .post(placeOrder);

router.post('/razorpay/create', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);

router.get('/my-orders', getMyOrders);

router.route('/admin/all')
  .get(isAdmin, getAdminOrders);

router.route('/admin/:id/status')
  .put(isAdmin, updateOrderStatus);

// Keep specific id fetch last to avoid matching dynamic words
router.route('/:id')
  .get(getOrderById);

export default router;
