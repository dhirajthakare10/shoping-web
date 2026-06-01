import Product from '../models/Product.js';

// @desc    Get all products (with search, category filter, price range, sorting, and pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 9 } = req.query;

    // Build query object
    const query = {};

    // 1. Text Search Keyword (on title or description)
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // 2. Category Filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // 3. Price Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Determine Sort Options
    let sortOptions = { createdAt: -1 }; // Default new arrivals
    if (sort) {
      if (sort === 'priceAsc') {
        sortOptions = { price: 1 };
      } else if (sort === 'priceDesc') {
        sortOptions = { price: -1 };
      } else if (sort === 'rating') {
        sortOptions = { ratings: -1 };
      }
    }

    // Pagination calculations
    const skip = (Number(page) - 1) * Number(limit);
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / Number(limit));

    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      page: Number(page),
      totalPages,
      totalProducts,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single product details (with related products)
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get 4 related products in same category (excluding current)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.status(200).json({
      success: true,
      product,
      relatedProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { title, description, category, price, discountPrice, stock } = req.body;

    // Handle image upload paths
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    } else if (req.body.images) {
      // Allow passing URLs or paths array directly
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const product = await Product.create({
      title,
      description,
      category,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: Number(stock),
      images
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Handle image files if newly uploaded
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Perform updates
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / update product review
// @route   POST /api/products/:id/review
// @access  Private
export const addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and comment' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      r => r.userId.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      // Update existing review
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
      alreadyReviewed.createdAt = Date.now();
    } else {
      // Add new review
      const review = {
        userId: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
      };
      product.reviews.push(review);
    }

    // Update product overall ratings
    product.calculateAverageRating();
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review submitted successfully',
      ratings: product.ratings,
      reviews: product.reviews
    });
  } catch (error) {
    next(error);
  }
};
