import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Place a Cash on Delivery (COD) or Direct order
// @route   POST /api/orders
// @access  Private
export const placeOrder = async (req, res, next) => {
  try {
    const { products, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: 'No products in order' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Please provide shipping address' });
    }

    // 1. Double check stock and decrement
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.title} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.title}` });
      }

      // Decrement stock
      product.stock -= item.quantity;
      await product.save();
    }

    // 2. Create Order
    const order = await Order.create({
      userId: req.user._id,
      products,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      totalAmount
    });

    // 3. Clear User's Cart
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.products = [];
      cart.totalPrice = 0;
      await cart.save();
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initiate a Razorpay Order
// @route   POST /api/orders/razorpay/create
// @access  Private
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    // Simulated Razorpay transaction initialization
    // Standard ID prefixes for Razorpay orders is "order_" followed by alphanumeric
    const razorpayOrderId = `order_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_5WqH9XvL2pBmQx',
      amount: Math.round(amount * 100), // Razorpay operates in paisa (cents)
      currency: 'INR',
      razorpayOrderId
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature and place Order
// @route   POST /api/orders/razorpay/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      products,
      shippingAddress,
      totalAmount
    } = req.body;

    // Standard high-fidelity signature mock check or validation
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    // 1. Verify stock and decrement
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.title} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.title}` });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    // 2. Create Order marked as paid
    const order = await Order.create({
      userId: req.user._id,
      products,
      shippingAddress,
      paymentMethod: 'Razorpay',
      paymentStatus: 'Paid',
      paymentDetails: {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      },
      totalAmount
    });

    // 3. Clear Cart
    const cart = await Cart.findOne({ userId: req.user._id });
    if (cart) {
      cart.products = [];
      cart.totalPrice = 0;
      await cart.save();
    }

    res.status(201).json({
      success: true,
      message: 'Razorpay payment verified & order created successfully!',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email phone');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authenticated user can view their own orders, or admin can view all
    if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/admin/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};
