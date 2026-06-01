import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get dashboard analytics metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    // 1. Core counters
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();

    // 2. Compute total revenue
    // Standard sum aggregation of totalAmount on non-cancelled orders
    const revenueStats = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' }, paymentStatus: 'Paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalSalesRevenue = revenueStats.length > 0 ? parseFloat(revenueStats[0].totalRevenue.toFixed(2)) : 0;

    // 3. Get recent orders (limit 5) populated with user details
    const recentOrders = await Order.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // 4. Sales analytics by Category
    const salesByCategory = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $unwind: '$products' },
      // Lookup category from product collection to group properly
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          salesCount: { $sum: '$products.quantity' },
          revenue: { $sum: { $multiply: ['$products.price', '$products.quantity'] } }
        }
      },
      { $project: { category: '$_id', salesCount: 1, revenue: 1, _id: 0 } }
    ]);

    // 5. Weekly Sales Trend
    const salesTrend = await Order.aggregate([
      {
        $match: {
          orderStatus: { $ne: 'Cancelled' },
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // past 30 days
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', totalSales: 1, orderCount: 1, _id: 0 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalSalesRevenue
      },
      recentOrders,
      salesByCategory,
      salesTrend
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user role between User & Admin
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const toggleUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent self-role swapping to lock out administrators by accident
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot revoke your own administrator credentials' });
    }

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role successfully changed to ${user.role}`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUserByAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
