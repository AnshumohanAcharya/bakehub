import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require superAdmin
router.use(authenticate);
router.use(authorize('superAdmin'));

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysOrders = await Order.countDocuments({ createdAt: { $gte: today } });

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const totalCommission = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$commission' } } }
    ]);

    const activeDeliveryBoys = await User.countDocuments({
      role: 'deliveryBoy',
      isActive: true
    });

    const pendingDeliveries = await Order.countDocuments({
      orderStatus: { $in: ['Pending', 'Preparing', 'Assigned to Delivery Boy'] }
    });

    res.json({
      totalOrders,
      todaysOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCommission: totalCommission[0]?.total || 0,
      activeDeliveryBoys,
      pendingDeliveries
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delivery Boy Management
router.get('/delivery-boys', async (req, res) => {
  try {
    const deliveryBoys = await User.find({ role: 'deliveryBoy' })
      .sort({ createdAt: -1 });

    const deliveryBoysWithStats = await Promise.all(
      deliveryBoys.map(async (db) => {
        const orders = await Order.find({ deliveryBoyId: db._id });
        return {
          ...db.toObject(),
          stats: {
            totalOrders: orders.length,
            deliveredCount: orders.filter(o => o.orderStatus === 'Delivered').length
          }
        };
      })
    );

    res.json(deliveryBoysWithStats);
  } catch (error) {
    console.error('Get delivery boys error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/delivery-boys', async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email?.toLowerCase()?.trim();
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    
    if (existingUser) {
      // If user exists and is already a delivery boy, update their info
      if (existingUser.role === 'deliveryBoy') {
        // Update existing delivery boy with new data
        Object.assign(existingUser, {
          ...req.body,
          email: normalizedEmail,
          role: 'deliveryBoy'
        });
        await existingUser.save();
        return res.status(200).json(existingUser);
      } else {
        // Convert existing user (customer/superAdmin) to delivery boy
        const previousRole = existingUser.role;
        Object.assign(existingUser, {
          ...req.body,
          email: normalizedEmail,
          role: 'deliveryBoy',
          isActive: req.body.isActive !== undefined ? req.body.isActive : true
        });
        await existingUser.save();
        return res.status(200).json({
          ...existingUser.toObject(),
          message: `User converted from ${previousRole} to deliveryBoy`
        });
      }
    }

    // Create new delivery boy if user doesn't exist
    const deliveryBoy = new User({
      ...req.body,
      email: normalizedEmail,
      role: 'deliveryBoy'
    });
    await deliveryBoy.save();
    res.status(201).json(deliveryBoy);
  } catch (error) {
    console.error('Create delivery boy error:', error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `A user with this ${field} already exists. Please use a different ${field}.` 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

router.put('/delivery-boys/:id', async (req, res) => {
  try {
    const { email } = req.body;
    
    // First, get the current delivery boy to check if email is actually changing
    const currentDeliveryBoy = await User.findOne({ 
      _id: req.params.id, 
      role: 'deliveryBoy' 
    });

    if (!currentDeliveryBoy) {
      return res.status(404).json({ message: 'Delivery boy not found' });
    }

    // Normalize email for comparison
    const normalizedEmail = email?.toLowerCase()?.trim();
    const currentEmail = currentDeliveryBoy.email?.toLowerCase()?.trim();
    
    // Only check for duplicate if email is being changed
    if (email && normalizedEmail !== currentEmail) {
      const existingUser = await User.findOne({ 
        email: normalizedEmail,
        _id: { $ne: req.params.id }
      });
      if (existingUser) {
        return res.status(400).json({ 
          message: `A user with email ${email} already exists. Please use a different email.` 
        });
      }
    }

    const updateData = { ...req.body };
    if (email) {
      updateData.email = normalizedEmail;
    }

    const deliveryBoy = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'deliveryBoy' },
      updateData,
      { new: true, runValidators: true }
    );

    res.json(deliveryBoy);
  } catch (error) {
    console.error('Update delivery boy error:', error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `A user with this ${field} already exists. Please use a different ${field}.` 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

router.delete('/delivery-boys/:id', async (req, res) => {
  try {
    const deliveryBoy = await User.findOneAndDelete({
      _id: req.params.id,
      role: 'deliveryBoy'
    });

    if (!deliveryBoy) {
      return res.status(404).json({ message: 'Delivery boy not found' });
    }

    res.json({ message: 'Delivery boy deleted successfully' });
  } catch (error) {
    console.error('Delete delivery boy error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Customer Management (read-only)
router.get('/customers', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const customers = await User.find({ role: 'customer' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments({ role: 'customer' });

    res.json({
      customers,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: 'customer'
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const orders = await Order.find({ userId: customer._id })
      .sort({ createdAt: -1 });

    res.json({
      ...customer.toObject(),
      orders
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

