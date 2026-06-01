import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a product title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a product description']
  },
  category: {
    type: String,
    required: [true, 'Please add a product category'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price'],
    min: [0, 'Price must be positive']
  },
  discountPrice: {
    type: Number,
    default: 0,
    validate: {
      validator: function(val) {
        return val < this.price;
      },
      message: 'Discount price must be less than the regular price'
    }
  },
  images: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    required: [true, 'Please add product stock qty'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  ratings: {
    type: Number,
    default: 0
  },
  reviews: [ReviewSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update the average ratings whenever a review is saved
ProductSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.ratings = 0;
  } else {
    const sum = this.reviews.reduce((acc, item) => acc + item.rating, 0);
    this.ratings = parseFloat((sum / this.reviews.length).toFixed(1));
  }
};

const Product = mongoose.model('Product', ProductSchema);
export default Product;
