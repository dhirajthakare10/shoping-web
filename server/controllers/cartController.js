import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to recalculate cart total price from database product values
const recalculateCartTotal = async (cart) => {
  let total = 0;
  for (const item of cart.products) {
    const product = await Product.findById(item.productId);
    if (product) {
      // Use discountPrice if available, otherwise regular price
      const activePrice = product.discountPrice && product.discountPrice > 0 
        ? product.discountPrice 
        : product.price;
      total += activePrice * item.quantity;
    }
  }
  cart.totalPrice = parseFloat(total.toFixed(2));
  await cart.save();
  return cart;
};

// @desc    Get logged in user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'products.productId',
      select: 'title price discountPrice images stock category'
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, products: [], totalPrice: 0 });
    }

    // Refresh totals and save in case product prices changed
    await recalculateCartTotal(cart);

    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    // Check if product exists and is in stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock available' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, products: [], totalPrice: 0 });
    }

    // Check if product is already in cart
    const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (itemIndex > -1) {
      // Product exists, increment quantity
      cart.products[itemIndex].quantity += Number(quantity);
    } else {
      // Add new product item
      cart.products.push({ productId, quantity: Number(quantity) });
    }

    await cart.save();
    await recalculateCartTotal(cart);

    const populatedCart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'products.productId',
      select: 'title price discountPrice images stock'
    });

    res.status(200).json({
      success: true,
      message: 'Product added to cart successfully',
      cart: populatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart
// @access  Private
export const updateCartQuantity = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Product ID and quantity are required' });
    }

    if (Number(quantity) < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    // Verify stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < Number(quantity)) {
      return res.status(400).json({ success: false, message: `Only ${product.stock} items left in stock` });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Product not found in cart' });
    }

    // Set new quantity
    cart.products[itemIndex].quantity = Number(quantity);
    await cart.save();
    await recalculateCartTotal(cart);

    const populatedCart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'products.productId',
      select: 'title price discountPrice images stock'
    });

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart: populatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Splicing index match
    cart.products = cart.products.filter(p => p.productId.toString() !== productId);
    
    await cart.save();
    await recalculateCartTotal(cart);

    const populatedCart = await Cart.findOne({ userId: req.user._id }).populate({
      path: 'products.productId',
      select: 'title price discountPrice images stock'
    });

    res.status(200).json({
      success: true,
      message: 'Product removed from cart successfully',
      cart: populatedCart
    });
  } catch (error) {
    next(error);
  }
};
