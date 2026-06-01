import express from 'express';
import { 
  getDashboardAnalytics, 
  getAllUsers, 
  toggleUserRole, 
  deleteUserByAdmin 
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(isAdmin); // All endpoints below require active Admin verification

router.get('/dashboard', getDashboardAnalytics);
router.route('/users')
  .get(getAllUsers);

router.route('/users/:id/role')
  .put(toggleUserRole);

router.route('/users/:id')
  .delete(deleteUserByAdmin);

export default router;
