# 🔐 Admin Panel Setup Guide

Complete guide to set up and access the BakeHub Admin Panel.

## ✅ Admin Panel Features

The admin panel includes:

1. **Dashboard** - Statistics and overview
2. **Categories** - Manage product categories
3. **Products** - Add/edit/delete products
4. **Orders** - View and manage all orders
5. **Delivery Boys** - Manage delivery personnel
6. **Customers** - View customer list
7. **Banners** - Manage homepage banners
8. **Coupons** - Create and manage discount coupons
9. **Pincodes** - Manage delivery pincodes

## 🚀 Quick Setup

### Step 1: Create Super Admin User

```bash
cd backend
npm run create-admin
```

This creates a super admin with email: `admin@bakehub.com`

### Step 2: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 3: Login to Admin Panel

1. Open: http://localhost:5173
2. Click "Login"
3. Enter: `admin@bakehub.com`
4. Click "Send OTP"
5. Check your email for OTP
6. Enter OTP and login
7. Click your profile icon → "Admin Panel"
8. Or go directly to: http://localhost:5173/admin

---

## 📋 Admin Panel Access

### URL Routes

- **Admin Dashboard:** http://localhost:5173/admin
- **Categories:** http://localhost:5173/admin/categories
- **Products:** http://localhost:5173/admin/products
- **Orders:** http://localhost:5173/admin/orders
- **Delivery Boys:** http://localhost:5173/admin/delivery-boys
- **Customers:** http://localhost:5173/admin/customers
- **Banners:** http://localhost:5173/admin/banners
- **Coupons:** http://localhost:5173/admin/coupons
- **Pincodes:** http://localhost:5173/admin/pincodes

### Access Control

- ✅ Only users with `role: "superAdmin"` can access admin panel
- ✅ All admin routes are protected
- ✅ Regular customers and delivery boys cannot access

---

## 🛠️ Initial Admin Panel Configuration

After logging in, configure these:

### 1. Add Categories

Go to: **Admin Panel → Categories**

Add these categories:
- Cakes
- Sweets
- Pastries
- Custom Cakes
- Eggless Cakes

**Steps:**
1. Click "+ Add Category"
2. Enter category name
3. Add description (optional)
4. Upload/add image URL (optional)
5. Set status to "Active"
6. Click "Create Category"

### 2. Add Products

Go to: **Admin Panel → Products**

**Steps:**
1. Click "+ Add Product"
2. Fill in product details:
   - Name
   - Category (select from dropdown)
   - Description
   - Weight options (½ kg, 1 kg, 2 kg) with prices
   - Stock quantity
   - Egg/Eggless options
   - Images (URLs)
3. Set status to "Active"
4. Click "Create Product"

### 3. Add Delivery Pincodes

Go to: **Admin Panel → Pincodes**

**Quick way:** Run this command:
```bash
cd backend
npm run add-pincodes
```

**Or manually:**
1. Click "+ Add Pincode"
2. Enter pincode (6 digits)
3. Enter city and state
4. Set status to "Active"
5. Click "Add Pincode"

### 4. Add Delivery Boys

Go to: **Admin Panel → Delivery Boys**

**Steps:**
1. Click "+ Add Delivery Boy"
2. Fill in details:
   - Full Name
   - Email (for OTP login)
   - Mobile Number
   - Vehicle Type (Bike/Cycle/Car)
   - Vehicle Number
   - Area/Zone
3. Set status to "Active"
4. Click "Create Delivery Boy"

### 5. Create Banners (Optional)

Go to: **Admin Panel → Banners**

**Steps:**
1. Click "+ Add Banner"
2. Fill in:
   - Title: "New Year Offer 2026"
   - Description: "Up to 30% OFF on Cakes & Sweets"
   - Coupon Code: "NEWYEAR26"
   - Image URL
   - Button Text: "Order Now"
3. Set order/priority
4. Set status to "Active"
5. Click "Create Banner"

### 6. Create Coupons (Optional)

Go to: **Admin Panel → Coupons**

**Quick way:** Run this command:
```bash
cd backend
npm run add-coupon
```

**Or manually:**
1. Click "+ Add Coupon"
2. Fill in:
   - Code: "NEWYEAR26"
   - Discount Type: Percentage
   - Discount Value: 30
   - Min Order Amount: 500
   - Max Discount: 1000
   - Valid From/Until dates
   - Usage Limit: 100
3. Set status to "Active"
4. Click "Create Coupon"

---

## 📊 Admin Panel Features Explained

### Dashboard
- Total orders count
- Today's orders
- Total revenue
- Total commission earned
- Active delivery boys count
- Pending deliveries

### Categories Management
- Add new categories
- Edit existing categories
- Delete categories
- Enable/Disable categories
- Upload category images
- **Important:** Only active categories show to customers

### Products Management
- Add products with multiple weight options
- Set egg/eggless options
- Manage stock
- Upload multiple images
- Set pricing per weight
- Enable/Disable products

### Orders Management
- View all orders
- Filter by status
- Update order status
- Assign delivery boys
- View customer details
- View order items and totals

### Delivery Boys Management
- Add delivery boys
- Edit delivery boy details
- Enable/Disable delivery boys
- View delivery statistics
- Track order history

### Customers Management
- View all customers (read-only)
- View customer details
- View customer order history

### Banners Management
- Create homepage banners
- Set display order
- Link coupons to banners
- Enable/Disable banners

### Coupons Management
- Create discount coupons
- Set percentage or fixed discounts
- Set minimum order amounts
- Set usage limits
- Set validity dates

### Pincodes Management
- Add serviceable pincodes
- Enable/Disable pincodes
- Manage delivery areas

---

## 🔒 Security

- Admin panel routes are protected
- Only `superAdmin` role can access
- JWT token required for all API calls
- Role-based middleware enforces access control

---

## 🆘 Troubleshooting

### Can't Access Admin Panel

1. **Check you're logged in as super admin:**
   - Email must be: `admin@bakehub.com`
   - Role must be: `superAdmin`

2. **Create admin if not exists:**
   ```bash
   cd backend
   npm run create-admin
   ```

3. **Check backend is running:**
   - Backend should be on port 5000
   - Check console for errors

4. **Check browser console:**
   - Open DevTools (F12)
   - Check for errors in Console tab

### Admin Panel Shows Empty/No Data

1. **Add initial data:**
   - Add categories
   - Add products
   - Add pincodes

2. **Check database connection:**
   - Verify MongoDB is running
   - Check `MONGODB_URI` in `.env`

### Can't Create Admin User

1. **Check MongoDB is running**
2. **Verify `.env` file has `MONGODB_URI`**
3. **Check backend console for errors**

---

## 📝 Quick Reference

```bash
# Create admin
npm run create-admin

# Add sample data
npm run add-pincodes
npm run add-coupon

# Start backend
npm run dev

# Start frontend (in another terminal)
cd ../frontend
npm run dev
```

---

## 🎯 Next Steps After Setup

1. ✅ Login to admin panel
2. ✅ Add categories
3. ✅ Add products
4. ✅ Add delivery pincodes
5. ✅ Add delivery boys
6. ✅ Create banners and coupons
7. ✅ Start accepting orders!

---

**Admin Panel is ready! 🎉**

For more details, see [README.md](./README.md)


