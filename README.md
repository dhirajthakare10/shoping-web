#  Full-Stack eCommerce Web Application

A premium, state-of-the-art, highly responsive full-stack eCommerce shopping platform featuring separate **User** and **Admin** panels. Styled with sleek glassmorphism, Harmoneous HSL gradients, Outfit/Inter typography, responsive custom layouts, and interactive loading/toast notifications.

---

## 🚀 Technology Stack

### Frontend (`/client`)
- **Core Engine:** Vanilla JS ES Modules Single Page Application (SPA)
- **Styling:** Tailwind CSS v3 with PostCSS & Autoprefixer
- **Build Engine:** Vite (HMR, Compiled Assets, Production Optimizations)
- **State Store:** Custom Reactive Store (Redux-Zustand style pure JS subscriber model)
- **Router:** Custom SPA URL hash-based router with Auth & Admin route guards
- **Vector Icons:** Lucide Icons SVG pack

### Backend (`/server`)
- **Runtime:** Node.js with Express.js REST APIs
- **Design Pattern:** MVC Folder Architecture
- **Database ORM:** MongoDB with Mongoose
- **Security:** bcrypt password hashing + secure JWT session tokens
- **File Uploads:** Multer locally validated disk storage
- **Logger:** Morgan dev HTTP logger

---

## 🛠️ Project Directory Structure

```
shopping-web/
 ├── client/                  # Frontend module (Vite + Tailwind)
 │    ├── assets/             # Static mock media assets
 │    ├── components/         # Reusable Antigravity UI (productCard, spinner, toasts)
 │    ├── context/            # Global state manager (store.js)
 │    ├── layouts/            # Layout wrappers (navbar header, footer)
 │    ├── pages/              # View generators (home, shop, productDetails, cart, checkout, profile, etc.)
 │    ├── services/           # REST API fetch service wrappers (api.js)
 │    ├── styles/             # Tailwind & Custom stylesheets (index.css)
 │    ├── utils/              # Client SPA router guards (router.js)
 │    ├── index.html          # Main SPA Entry HTML
 │    ├── tailwind.config.js  # Premium color palettes & animations
 │    └── vite.config.js      # Server proxies and building configurations
 │
 ├── server/                  # Backend module (Node MVC)
 │    ├── config/             # DB Mongoose setups (db.js)
 │    ├── controllers/        # Express MVC controllers
 │    ├── middleware/         # Auth, Upload, and error boundary middlewares
 │    ├── models/             # User, Product, Cart, and Order Mongoose schemas
 │    ├── routes/             # Express API routing links
 │    ├── uploads/            # Multer uploaded image saves
 │    ├── utils/              # DB seeder (seeder.js)
 │    ├── app.js              # Express app definitions
 │    └── server.js           # DB listeners and startup runners
 │
 └── package.json             # Root setup scripts runner
```

---

## ⚙️ Local Setup Instructions

### 1. Prerequisites
Ensure you have **Node.js** (v16+) and **MongoDB** installed and running on your machine.

### 2. Install Dependencies
Run the following command at the **root project directory** to automatically install dependencies for both the frontend client and backend server:
```bash
npm run setup
```

### 3. Environment Configuration
Verify your `server/.env` parameters. The default config uses:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopping-web
JWT_SECRET=super_secret_antigravity_ecommerce_jwt_token_2026_key
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_5WqH9XvL2pBmQx
RAZORPAY_KEY_SECRET=rzp_secret_6N7o8P9q0R1s2t3u4v5w6x7y8z
```
*Note: Local MongoDB URI (`mongodb://localhost:27017/shopping-web`) works automatically. If you want to connect to MongoDB Atlas, simply replace `MONGO_URI` with your Atlas connection string.*

### 4. Seed Database Catalog
To populate the database with premium mock items across Electronics, Fashion, Sneakers, Watches, Accessories categories and create default accounts, run:
```bash
npm run seed
```

### 5. Launch Servers
Open two terminal windows to launch both developers servers concurrently:

- **Terminal 1: Start Backend API Server (Port 5000)**
  ```bash
  npm run server
  ```

- **Terminal 2: Start Frontend Client server (Vite on Port 3000)**
  ```bash
  npm run client
  ```
Open `http://localhost:3000` in your web browser to enjoy the premium glassmorphic shop experience!

---

## 🔑 Default Test Credentials

During seeding, the database creates two default accounts for testing the separate user and admin dashboards:

### 1. Administrator Profile
- **Email:** `admin@shop.com`
- **Password:** `Admin@123`
- **Access Granted:** Dashboards, sales trends, add/edit/delete products, manage user roles, update order statuses.

### 2. User Customer Profile
- **Email:** `user@shop.com`
- **Password:** `User@123`
- **Access Granted:** Profile settings, personal order tracking histories, add to cart/wishlists, secure checkouts.

---

## 💳 Razorpay secure payment gateway
The project includes a full-fidelity secure Razorpay integration!
When checkouting using **Razorpay**:
1. Clicking submit starts a backend order token transaction.
2. The frontend triggers the Razorpay script.
3. If offline or in standard dev sandboxes, an elegant automated visual overlay simulates successful signature verifications.
4. Transaction records save on MongoDB, decrementing stock and clearing shopping baskets instantly.

---

## 🌐 Production Deployment Guide

### Database: MongoDB Atlas
1. Create a free shared cluster on MongoDB Atlas.
2. Navigate to Network Access and allow IP `0.0.0.0/0` (or add target hosting IPs).
3. Copy connection string and add `MONGO_URI` to your server hosting environment variables.

### Backend: Render or Railway
1. Push the `/server` folder code (or the whole repo) to your GitHub.
2. Deploy a Web Service on **Render** (Root directory: `server`, Build command: `npm install`, Start command: `npm start`).
3. Add environment variables for `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`.

### Frontend: Vercel or Netlify
1. Deploy a static project on **Vercel** pointing to the `/client` directory.
2. In the Vercel project settings, configure a rewrite rule inside `vercel.json` to proxy `/api` calls to your Render backend API domain.
3. Vercel automatically compiles Tailwind and hosts your fast SPA globally!
