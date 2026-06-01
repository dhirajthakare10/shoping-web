import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { seedDatabase } from './utils/seeder.js';

// Load Environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(async () => {
  // Auto Seed Database if clean
  console.log('Validating database seeds status...');
  await seedDatabase();
  
  // Start server listener
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`\x1b[35m%s\x1b[0m`, `Server active in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
  });
});
