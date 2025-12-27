# 🎂 BakeHub - E-Commerce Platform for Bakery Products

A full-stack e-commerce platform built with React and Node.js for ordering bakery products online. Features separate panels for customers, admins, and delivery personnel with complete order management, payment integration, and delivery tracking.

![BakeHub](https://img.shields.io/badge/BakeHub-E-Commerce-orange)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [User Roles](#user-roles)
- [API Documentation](#api-documentation)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 👤 Customer Features
- **Product Browsing**: Browse products by categories with search functionality
- **Product Details**: View detailed product information with images
- **Shopping Cart**: Add/remove items, update quantities
- **Pincode Verification**: Check delivery availability by pincode
- **Multiple Addresses**: Save and manage multiple delivery addresses
- **Order Management**: Place orders, view order history, track order status
- **Coupon System**: Apply discount coupons at checkout
- **Payment Integration**: Secure payment via Razorpay
- **OTP Authentication**: Secure login with email OTP
- **Profile Management**: Update personal information

### 👨‍💼 Admin Features
- **Dashboard**: View comprehensive statistics and analytics
- **Product Management**: Add, edit, delete products with images
- **Category Management**: Organize products into categories
- **Order Management**: View all orders, assign delivery boys, update status
- **Customer Management**: View and manage customer accounts
- **Delivery Boy Management**: Add, edit, activate/deactivate delivery personnel
- **Banner Management**: Create and manage promotional banners
- **Coupon Management**: Create and manage discount coupons
- **Pincode Management**: Manage delivery serviceable pincodes
- **Revenue Tracking**: Monitor total revenue and commissions

### 🚴 Delivery Boy Features
- **Dashboard**: View assigned orders and delivery statistics
- **Order Management**: View assigned orders with customer details
- **Status Updates**: Update order status (Picked Up, Out for Delivery, Delivered)
- **Customer Contact**: Direct call functionality to customers
- **Google Maps Integration**: Interactive map to view customer delivery locations
- **Real-time Location Tracking**: Share your location in real-time while delivering
- **Live Route Display**: See the route between your location and customer address on the map
- **Navigation**: Get directions to customer addresses via Google Maps
- **Order History**: Track delivered orders

---

## 🛠 Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **React Router DOM 6.20.1** - Routing
- **Vite 5.0.8** - Build tool and dev server
- **Tailwind CSS 3.3.6** - Styling
- **Axios 1.6.2** - HTTP client
- **React Hot Toast 2.4.1** - Notifications
- **Date-fns 2.30.0** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express 4.18.2** - Web framework
- **MongoDB** - Database
- **Mongoose 8.0.3** - ODM for MongoDB
- **JWT (jsonwebtoken 9.0.2)** - Authentication
- **Bcryptjs 2.4.3** - Password hashing
- **Nodemailer 6.9.7** - Email service
- **Razorpay 2.9.2** - Payment gateway
- **Express Validator 7.0.1** - Input validation
- **CORS 2.8.5** - Cross-origin resource sharing

---

## 📁 Project Structure

```
bakehub/
├── backend/                    # Backend API
│   ├── middleware/             # Authentication middleware
│   │   └── auth.js            # JWT authentication
│   ├── models/                # MongoDB models
│   │   ├── User.js            # User model
│   │   ├── Product.js         # Product model
│   │   ├── Category.js        # Category model
│   │   ├── Order.js           # Order model
│   │   ├── Address.js         # Address model
│   │   ├── Banner.js          # Banner model
│   │   ├── Coupon.js          # Coupon model
│   │   └── DeliveryPincode.js # Pincode model
│   ├── routes/                # API routes
│   │   ├── auth.js           # Authentication routes
│   │   ├── products.js       # Product routes
│   │   ├── categories.js     # Category routes
│   │   ├── orders.js         # Order routes
│   │   ├── addresses.js      # Address routes
│   │   ├── coupons.js        # Coupon routes
│   │   ├── banners.js        # Banner routes
│   │   ├── deliveryBoy.js    # Delivery boy routes
│   │   ├── admin.js          # Admin routes
│   │   ├── deliveryPincodes.js # Pincode routes
│   │   └── payments.js      # Payment routes
│   ├── scripts/               # Utility scripts
│   │   ├── createAdmin.js    # Create admin user
│   │   ├── addSamplePincodes.js # Add sample pincodes
│   │   └── addSampleCoupon.js # Add sample coupon
│   ├── utils/                 # Utility functions
│   │   ├── emailService.js   # Email service
│   │   └── generateTokens.js # JWT token generation
│   ├── server.js              # Server entry point
│   └── package.json          # Backend dependencies
│
└── frontend/                   # Frontend React app
    ├── src/
    │   ├── components/        # Reusable components
    │   │   ├── Header.jsx    # Navigation header
    │   │   ├── Footer.jsx    # Footer component
    │   │   ├── Layout.jsx    # Main layout
    │   │   ├── AdminLayout.jsx # Admin layout
    │   │   ├── DeliveryLayout.jsx # Delivery layout
    │   │   ├── ProductCard.jsx # Product card
    │   │   ├── CategoryCard.jsx # Category card
    │   │   ├── Banner.jsx     # Banner component
    │   │   ├── PincodeCheck.jsx # Pincode checker
    │   │   └── ProtectedRoute.jsx # Route protection
    │   ├── pages/             # Page components
    │   │   ├── customer/     # Customer pages
    │   │   │   ├── Home.jsx  # Homepage
    │   │   │   ├── Products.jsx # Products listing
    │   │   │   ├── ProductDetail.jsx # Product details
    │   │   │   ├── Cart.jsx  # Shopping cart
    │   │   │   ├── Checkout.jsx # Checkout page
    │   │   │   ├── Orders.jsx # Order history
    │   │   │   ├── Profile.jsx # User profile
    │   │   │   └── Addresses.jsx # Address management
    │   │   ├── admin/        # Admin pages
    │   │   │   ├── Dashboard.jsx # Admin dashboard
    │   │   │   ├── Products.jsx # Product management
    │   │   │   ├── Categories.jsx # Category management
    │   │   │   ├── Orders.jsx # Order management
    │   │   │   ├── Customers.jsx # Customer management
    │   │   │   ├── DeliveryBoys.jsx # Delivery boy management
    │   │   │   ├── Banners.jsx # Banner management
    │   │   │   ├── Coupons.jsx # Coupon management
    │   │   │   └── Pincodes.jsx # Pincode management
    │   │   ├── delivery/    # Delivery boy pages
    │   │   │   ├── Dashboard.jsx # Delivery dashboard
    │   │   │   └── Orders.jsx # Assigned orders
    │   │   └── auth/         # Authentication
    │   │       └── Login.jsx # Login page
    │   ├── context/          # React contexts
    │   │   ├── AuthContext.jsx # Authentication context
    │   │   └── CartContext.jsx # Shopping cart context
    │   ├── App.jsx           # Main app component
    │   └── main.jsx          # Entry point
    ├── vite.config.js        # Vite configuration
    └── package.json          # Frontend dependencies
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

### Verify Installation

```bash
node --version    # Should be v16 or higher
npm --version     # Should be v8 or higher
mongod --version  # MongoDB should be installed
```

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bakehub
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bakehub

# JWT Secrets (Generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# Email Configuration (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-specific-password

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Google Maps API Key (for geocoding addresses to coordinates)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### How to Get Environment Variables

#### 1. MongoDB URI
- **Local**: `mongodb://localhost:27017/bakehub`
- **MongoDB Atlas**: Get connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

#### 2. JWT Secrets
Generate strong random strings:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 3. Gmail App Password
1. Enable 2-Step Verification in Google Account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate password for "Mail"
4. Use this password in `GMAIL_APP_PASSWORD`

#### 4. Razorpay Keys
1. Sign up at [Razorpay](https://razorpay.com/)
2. Dashboard → Settings → API Keys
3. Generate Test/Live keys
4. Copy Key ID and Key Secret

#### 5. Google Maps API Key (for Delivery Tracking and Address Geocoding)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API** (for displaying maps in frontend)
   - **Geocoding API** (for converting addresses to coordinates)
   - **Directions API** (for showing routes between delivery boy and customer)
   - Navigate to "APIs & Services" → "Library"
   - Search for each API and click "Enable"
4. Create credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key
5. Add the API key to both:
   - Backend `.env` file: `GOOGLE_MAPS_API_KEY=your-api-key`
   - Frontend `.env` file: `VITE_GOOGLE_MAPS_API_KEY=your-api-key`
6. (Optional) Restrict the API key for security:
   - Click on the API key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose "Maps JavaScript API", "Geocoding API", and "Directions API"
   - Under "Application restrictions", you can restrict by HTTP referrer (frontend) or IP address (backend)

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API URL
VITE_API_URL=http://localhost:5000/api

# Google Maps API Key (for delivery tracking)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here
```

**Note:** The Google Maps API key is required for the delivery boy to view customer locations on the map. Without it, a fallback link to Google Maps will be shown.

---

## 🏃 Running the Application

### 1. Start MongoDB

**Windows:**
```bash
# MongoDB should start automatically as a service
# Or start manually:
mongod
```

**macOS/Linux:**
```bash
brew services start mongodb-community
# Or: mongod
```

### 2. Create Admin User

```bash
cd backend
npm run create-admin
```

This creates an admin with email: `varunsandeshtalluru@gmail.com`

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### 5. Access the Application

- **Customer Portal**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
- **Delivery Boy Panel**: http://localhost:5173/delivery

---

## 👥 User Roles

### Customer
- **Access**: Main website (`/`)
- **Features**: Browse products, add to cart, place orders, manage addresses
- **Registration**: Any email (OTP authentication)

### Admin (Super Admin)
- **Access**: Admin Panel (`/admin`)
- **Default Email**: `varunsandeshtalluru@gmail.com`
- **Features**: Full system management, product/order/customer management
- **Login**: OTP authentication

### Delivery Boy
- **Access**: Delivery Boy Panel (`/delivery`)
- **Features**: View assigned orders, update delivery status
- **Creation**: Created by admin via Admin Panel

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/send-otp` | Send OTP to email | No |
| POST | `/api/auth/verify-otp` | Verify OTP and login | No |
| POST | `/api/auth/refresh` | Refresh access token | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get product details | No |
| GET | `/api/products/bestsellers` | Get bestseller products | No |
| POST | `/api/products` | Create product (Admin) | Admin |
| PUT | `/api/products/:id` | Update product (Admin) | Admin |
| DELETE | `/api/products/:id` | Delete product (Admin) | Admin |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create new order | Customer |
| GET | `/api/orders` | Get user orders | Customer |
| GET | `/api/orders/:id` | Get order details | Customer/Admin |
| GET | `/api/orders/admin/all` | Get all orders (Admin) | Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |
| PUT | `/api/orders/:id/assign-delivery` | Assign delivery boy | Admin |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/dashboard` | Get dashboard stats | Admin |
| GET | `/api/admin/customers` | Get all customers | Admin |
| GET | `/api/admin/delivery-boys` | Get all delivery boys | Admin |
| POST | `/api/admin/delivery-boys` | Create delivery boy | Admin |
| PUT | `/api/admin/delivery-boys/:id` | Update delivery boy | Admin |
| DELETE | `/api/admin/delivery-boys/:id` | Delete delivery boy | Admin |

### Delivery Boy Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/delivery-boy/profile` | Get delivery boy profile | Delivery Boy |
| GET | `/api/delivery-boy/orders` | Get assigned orders | Delivery Boy |
| PUT | `/api/delivery-boy/orders/:id/status` | Update order status | Delivery Boy |

### Payment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payments/create-order` | Create Razorpay order | Customer |
| POST | `/api/payments/verify` | Verify payment | Customer |

---

## 📜 Available Scripts

### Backend Scripts

```bash
cd backend

# Development
npm run dev          # Start development server with nodemon

# Production
npm start            # Start production server

# Setup Scripts
npm run create-admin # Create super admin user
npm run add-pincodes # Add sample delivery pincodes
npm run add-coupon   # Add sample coupon (NEWYEAR26)
npm run geocode-addresses # Geocode existing addresses (adds lat/lng coordinates)
```

### Frontend Scripts

```bash
cd frontend

# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 🚢 Deployment

### Backend Deployment

1. Set production environment variables
2. Install PM2:
   ```bash
   npm install -g pm2
   ```
3. Start with PM2:
   ```bash
   pm2 start server.js --name bakehub-backend
   ```

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy `dist` folder to:
   - **Vercel**: Connect GitHub repo
   - **Netlify**: Drag and drop `dist` folder
   - **AWS S3**: Upload `dist` contents
3. Update `FRONTEND_URL` in backend `.env`

### Environment Variables for Production

Update all environment variables with production values:
- Use MongoDB Atlas for database
- Use production Razorpay keys
- Use production email service
- Set secure JWT secrets
- Update CORS origins

---

## 🔧 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```
Error: MongoDB Connection Error
```
**Solution:**
- Ensure MongoDB is running
- Verify `MONGODB_URI` in `.env`
- Check MongoDB port (default: 27017)

**Port Already in Use**
```
Error: Port 5000 is already in use
```
**Solution:**
- Change `PORT` in `.env`
- Or kill process: `npx kill-port 5000`

**JWT Secret Error**
```
Error: JWT_SECRET is not defined
```
**Solution:**
- Ensure `.env` file exists in `backend` directory
- Add `JWT_SECRET` and `JWT_REFRESH_SECRET`

### Frontend Issues

**API Connection Error**
```
Network Error: Failed to fetch
```
**Solution:**
- Ensure backend is running on port 5000
- Check `vite.config.js` proxy configuration
- Verify CORS settings in backend

**Port Already in Use**
```
Error: Port 5173 is already in use
```
**Solution:**
- Kill process: `npx kill-port 5173`
- Or change port in `vite.config.js`

### Email Issues

**OTP Not Sending**
```
Error sending OTP
```
**Solution:**
- Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD`
- Ensure Gmail app password is correct (not regular password)
- Check 2-Step Verification is enabled

### Payment Issues

**Razorpay Error**
```
Razorpay order creation failed
```
**Solution:**
- Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- Ensure Razorpay keys are active
- Check Razorpay account status

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review error logs in console
3. Verify all environment variables are set correctly

---

## 🎯 Future Enhancements

- [ ] Real-time order tracking
- [ ] Push notifications
- [ ] SMS notifications
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Inventory management
- [ ] Review and rating system
- [ ] Wishlist functionality
- [ ] Social media integration

---

**Built with ❤️ for the bakery industry**

**Happy Coding! 🎂**

