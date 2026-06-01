import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';

dotenv.config({ path: '../.env' }); // Support running from server/ directory or utils/

const demoProducts = [
  // Electronics
  {
    title: 'Apple iPhone 15 Pro Max (256GB, Titanium)',
    description: 'Experience the titanium design, groundbreaking A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever with a 5x Telephoto zoom lens.',
    category: 'Electronics',
    price: 1399,
    discountPrice: 1299,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1695048132924-f7a63ce73e89?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 25,
    ratings: 4.8,
    reviews: [
      {
        name: 'Arjun Mehta',
        rating: 5,
        comment: 'Absolutely love the camera and the battery life is incredible. Titanium feel is amazing.',
        userId: new mongoose.Types.ObjectId()
      },
      {
        name: 'Sarah Connor',
        rating: 4,
        comment: 'Great phone, but super expensive. Worth it if you are upgrading from an older model.',
        userId: new mongoose.Types.ObjectId()
      }
    ]
  },
  {
    title: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    description: 'Industry-leading noise cancelling headphones with two processors controlling 8 microphones, Auto NC Optimizer, and exceptional call quality.',
    category: 'Electronics',
    price: 399,
    discountPrice: 349,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 40,
    ratings: 4.7,
    reviews: [
      {
        name: 'Emily Watson',
        rating: 5,
        comment: 'Best noise cancellation I have ever experienced. Battery lasts forever.',
        userId: new mongoose.Types.ObjectId()
      }
    ]
  },
  {
    title: 'Dell XPS 15 OLED Laptop',
    description: 'Stunning 15.6-inch OLED touchscreen display powered by Intel Core i7, 32GB RAM, 1TB SSD, and NVIDIA RTX 4050 graphics. Perfect for creators.',
    category: 'Electronics',
    price: 1999,
    discountPrice: 1849,
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 12,
    ratings: 4.6,
    reviews: []
  },
  // Fashion
  {
    title: 'Premium Classic Beige Trench Coat',
    description: 'A timeless double-breasted trench coat crafted from a water-resistant cotton blend. Features adjustable waist belt and premium lining.',
    category: 'Fashion',
    price: 249,
    discountPrice: 199,
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 35,
    ratings: 4.5,
    reviews: [
      {
        name: 'Rohan Sharma',
        rating: 4,
        comment: 'Very premium material. Fits true to size.',
        userId: new mongoose.Types.ObjectId()
      }
    ]
  },
  {
    title: 'Minimalist Slim Fit Denim Jacket',
    description: 'Vintage-washed denim jacket crafted from organic cotton. Classic styling with double chest pockets and metal buttons.',
    category: 'Fashion',
    price: 99,
    discountPrice: 79,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 50,
    ratings: 4.3,
    reviews: []
  },
  // Sneakers
  {
    title: 'Nike Air Jordan 1 Retro High OG',
    description: 'The sneaker that started it all. Featuring premium leather construction, classic high-top silhouette, and the iconic Wings logo.',
    category: 'Sneakers',
    price: 180,
    discountPrice: 0,
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 18,
    ratings: 4.9,
    reviews: [
      {
        name: 'Marcus Aurelius',
        rating: 5,
        comment: 'Absolute masterpiece. Comfortable and timeless style.',
        userId: new mongoose.Types.ObjectId()
      }
    ]
  },
  {
    title: 'Adidas Ultraboost Light Running Shoes',
    description: 'Experience epic energy with the new generation of Ultraboost. Lightest Boost midsole ever for ultimate running comfort and responsiveness.',
    category: 'Sneakers',
    price: 190,
    discountPrice: 159,
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 30,
    ratings: 4.7,
    reviews: []
  },
  // Watches
  {
    title: 'Apple Watch Ultra 2 (GPS + Cellular)',
    description: 'The ultimate sports and adventure watch. Featuring a rugged titanium case, up to 72 hours of battery life, and the brightest always-on Retina display.',
    category: 'Watches',
    price: 799,
    discountPrice: 749,
    images: [
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 15,
    ratings: 4.8,
    reviews: [
      {
        name: 'Kabir Sen',
        rating: 5,
        comment: 'Incredible upgrade from Series 6. The screen brightness under sunlight is stunning.',
        userId: new mongoose.Types.ObjectId()
      }
    ]
  },
  {
    title: 'Omega Speedmaster Professional Moonwatch',
    description: 'The legendary chronograph watch that played a role in all six lunar missions. Powered by OMEGAs manual-winding master chronometer caliber.',
    category: 'Watches',
    price: 7200,
    discountPrice: 6800,
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 5,
    ratings: 4.9,
    reviews: []
  },
  // Accessories
  {
    title: 'Saffiano Leather Bi-fold Wallet',
    description: 'Crafted from premium Italian Saffiano leather, featuring multiple card slots, dedicated cash sleeves, and RFID blocking technology.',
    category: 'Accessories',
    price: 85,
    discountPrice: 65,
    images: [
      'https://images.unsplash.com/photo-1627124709703-320529a67d7d?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 60,
    ratings: 4.4,
    reviews: []
  },
  {
    title: 'Ray-Ban Classic Aviator Sunglasses',
    description: 'The iconic pilot style sunglasses featuring gold metal frames, G-15 green lenses, providing 100% UV protection and exceptional clarity.',
    category: 'Accessories',
    price: 160,
    discountPrice: 139,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 45,
    ratings: 4.6,
    reviews: [
      {
        name: 'Tanvi Roy',
        rating: 4,
        comment: 'Classic and goes with everything. A wardrobe staple!',
        userId: new mongoose.Types.ObjectId()
      }
    ]
  },
  // Baby Products
  {
    title: 'Organic Cotton Baby Swaddle Blanket (Pack of 3)',
    description: 'Ultra-soft, breathable organic cotton swaddle blankets. Perfect for sensitive baby skin, ensuring warm, cozy sleep.',
    category: 'Baby Products',
    price: 35.00,
    discountPrice: 28.00,
    images: [
      'https://images.unsplash.com/photo-1522850959074-b78b5f89578b?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 45,
    ratings: 4.8,
    reviews: []
  },
  {
    title: 'Premium Ergonomic Baby Carrier',
    description: 'Multi-position baby carrier with lumbar support and ergonomic seat. Safely holds babies from newborn to toddler.',
    category: 'Baby Products',
    price: 120.00,
    discountPrice: 0,
    images: [
      'https://images.unsplash.com/photo-1602413139897-41a185d234d5?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 20,
    ratings: 4.7,
    reviews: []
  },
  // Personal Care
  {
    title: 'Sonic Electric Toothbrush with UV Sanitizer',
    description: 'High-frequency sonic toothbrush featuring 5 brushing modes, smart timer, and a wireless charging base with built-in UV brush head sanitizer.',
    category: 'Personal Care',
    price: 89.00,
    discountPrice: 69.00,
    images: [
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 35,
    ratings: 4.6,
    reviews: []
  },
  {
    title: 'Natural Eucalyptus & Mint Deodorant (2-Pack)',
    description: 'Aluminum-free, organic deodorant stick enriched with coconut oil and shea butter. Keeps you fresh all day long naturally.',
    category: 'Personal Care',
    price: 22.00,
    discountPrice: 0,
    images: [
      'https://images.unsplash.com/photo-1619451334792-150fd785ee74?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 100,
    ratings: 4.5,
    reviews: []
  },
  // Home Cleaning Essential
  {
    title: 'Eco-Friendly Concentrated Laundry Sheets',
    description: 'Zero-waste, plastic-free laundry sheets with lavender scent. Highly concentrated and biodegradable formula.',
    category: 'Home Cleaning',
    price: 18.00,
    discountPrice: 14.50,
    images: [
      'https://images.unsplash.com/photo-1610557892470-76d747eed2f3?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 120,
    ratings: 4.9,
    reviews: []
  },
  {
    title: 'Multi-Surface Natural Cleaning Spray Set',
    description: 'Trio of plant-based cleaning sprays (Lavender, Citrus, Eucalyptus) in reusable amber glass bottles. Tough on grease, gentle on the planet.',
    category: 'Home Cleaning',
    price: 32.00,
    discountPrice: 0,
    images: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 60,
    ratings: 4.7,
    reviews: []
  },
  // Jewellery
  {
    title: '14k Gold Plated Herringbone Chain Necklace',
    description: 'Elegantly designed flat snake herringbone chain, 18-inch length. Tarnish-resistant and hypoallergenic, perfect for layering.',
    category: 'Jewellery',
    price: 75.00,
    discountPrice: 59.00,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 30,
    ratings: 4.8,
    reviews: []
  },
  {
    title: 'Classic Sterling Silver Hoop Earrings',
    description: 'High-polished sterling silver hoop earrings with secure click-top closure. Timeless, versatile addition to any wardrobe.',
    category: 'Jewellery',
    price: 45.00,
    discountPrice: 0,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 50,
    ratings: 4.6,
    reviews: []
  },
  // Skincare Products
  {
    title: 'Hyaluronic Acid Hydrating Serum',
    description: 'Pure hyaluronic acid serum with Vitamin B5. Replenishes moisture, plumps fine lines, and restores skin barrier health.',
    category: 'Skincare',
    price: 28.00,
    discountPrice: 22.00,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 75,
    ratings: 4.8,
    reviews: []
  },
  {
    title: 'Botanical Vitamin C Brightening Daily Moisturizer',
    description: 'Lightweight moisturizing cream infused with Kakadu plum extract and Vitamin E to brighten dull skin and defend against environmental stressors.',
    category: 'Skincare',
    price: 38.00,
    discountPrice: 0,
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 40,
    ratings: 4.4,
    reviews: []
  },
  // Haircare
  {
    title: 'Argan Oil Restorative Hair Mask',
    description: 'Deep conditioning hair mask infused with pure Moroccan Argan oil and keratin. Repairs dry, color-treated, or damaged locks.',
    category: 'Haircare',
    price: 34.00,
    discountPrice: 27.00,
    images: [
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 55,
    ratings: 4.7,
    reviews: []
  },
  {
    title: 'Rosemary Mint Scalp Strengthening Shampoo',
    description: 'Invigorating sulfate-free shampoo formulated with rosemary oil, biotin, and peppermint to cleanse and stimulate hair follicles.',
    category: 'Haircare',
    price: 19.00,
    discountPrice: 0,
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 90,
    ratings: 4.5,
    reviews: []
  },
  // Household Essential
  {
    title: 'Bamboo Fiber Reusable Paper Towels',
    description: 'A roll of 20 reusable, washable bamboo sheets that replace up to 60 conventional paper rolls. Strong, absorbent, and sustainable.',
    category: 'Household Essentials',
    price: 24.00,
    discountPrice: 18.00,
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 85,
    ratings: 4.8,
    reviews: []
  },
  {
    title: 'Premium Stainless Steel Kitchen Compost Bin',
    description: 'Odor-free, 1.3-gallon countertop compost bin with dual charcoal filters. Heavy-duty construction and sleek modern design.',
    category: 'Household Essentials',
    price: 42.00,
    discountPrice: 0,
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
    ],
    stock: 25,
    ratings: 4.6,
    reviews: []
  }
];

export const seedDatabase = async () => {
  try {
    // 1. Seed default Admin if not exists
    const adminExists = await User.findOne({ email: 'admin@shop.com' });
    if (!adminExists) {
      console.log('Seeding default Admin account...');
      await User.create({
        name: 'Crazy Deal Admin',
        email: 'admin@shop.com',
        password: 'Admin@123', // Will be hashed by User model pre-save hook
        role: 'admin',
        phone: '+919999999999',
        address: {
          street: 'Premium Tech Boulevard',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          country: 'India'
        }
      });
      console.log('Default Admin seeded: admin@shop.com / Admin@123');
    }

    // 2. Seed Default User if not exists
    const userExists = await User.findOne({ email: 'user@shop.com' });
    if (!userExists) {
      console.log('Seeding default User account...');
      await User.create({
        name: 'Dhiraj Kumar',
        email: 'user@shop.com',
        password: 'User@123',
        role: 'user',
        phone: '+918888888888',
        address: {
          street: 'Shopping Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        }
      });
      console.log('Default User seeded: user@shop.com / User@123');
    }

    // 3. Seed Products if DB is empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding premium demo products...');
      await Product.insertMany(demoProducts);
      console.log(`Demo products seeded: ${demoProducts.length} items.`);
    }
  } catch (error) {
    console.error('Seeding Error:', error);
  }
};

// Expose a script path runner
const runIndependentSeeder = async () => {
  try {
    dotenv.config();
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/shopping-web';
    console.log(`Connecting to database for seeding: ${uri}`);
    await mongoose.connect(uri);
    
    // Clear databases
    console.log('Clearing old collections for clean seed...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});

    await seedDatabase();
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Independent Seeding Failed:', error);
    process.exit(1);
  }
};

// Check if run directly from node CLI
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  runIndependentSeeder();
}
