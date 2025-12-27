import express from 'express';
import Order from '../models/Order.js';
import Address from '../models/Address.js';
import DeliveryBoyLocation from '../models/DeliveryBoyLocation.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { geocodeAddress } from '../utils/geocoding.js';

const router = express.Router();

// Get assigned orders
router.get('/orders', authenticate, authorize('deliveryBoy'), async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoyId: req.user._id,
      orderStatus: { $in: ['Assigned to Delivery Boy', 'Picked Up', 'Out for Delivery'] }
    })
      .populate('userId', 'name mobileNumber')
      .populate('addressId')
      .sort({ deliveryAssignedAt: -1 });

    // Ensure all addresses have location data
    for (const order of orders) {
      if (order.addressId && (!order.addressId.location || !order.addressId.location.lat || !order.addressId.location.lng)) {
        try {
          const location = await geocodeAddress({
            houseNo: order.addressId.houseNo,
            street: order.addressId.street,
            city: order.addressId.city,
            state: order.addressId.state,
            pincode: order.addressId.pincode
          });
          if (location) {
            await Address.findByIdAndUpdate(order.addressId._id, { location });
            order.addressId.location = location;
          }
        } catch (error) {
          console.error('Error geocoding address in delivery orders:', error);
        }
      }
    }

    res.json(orders);
  } catch (error) {
    console.error('Get delivery orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/orders/:id/status', authenticate, authorize('deliveryBoy'), async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.deliveryBoyId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get delivery boy profile
router.get('/profile', authenticate, authorize('deliveryBoy'), async (req, res) => {
  try {
    const orders = await Order.find({ deliveryBoyId: req.user._id });
    const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered').length;

    res.json({
      ...req.user.toObject(),
      stats: {
        totalOrders: orders.length,
        deliveredCount
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update delivery boy location (real-time tracking)
router.post('/location', authenticate, authorize('deliveryBoy'), async (req, res) => {
  try {
    const { lat, lng, heading, speed, accuracy } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const locationData = {
      deliveryBoyId: req.user._id,
      location: { lat, lng },
      lastUpdated: new Date(),
      isActive: true
    };

    if (heading !== undefined) locationData.heading = heading;
    if (speed !== undefined) locationData.speed = speed;
    if (accuracy !== undefined) locationData.accuracy = accuracy;

    const location = await DeliveryBoyLocation.findOneAndUpdate(
      { deliveryBoyId: req.user._id },
      locationData,
      { upsert: true, new: true }
    );

    res.json(location);
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get delivery boy current location
router.get('/location', authenticate, authorize('deliveryBoy'), async (req, res) => {
  try {
    const location = await DeliveryBoyLocation.findOne({ 
      deliveryBoyId: req.user._id,
      isActive: true 
    });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get delivery boy location by ID (for admin/customer tracking)
router.get('/location/:deliveryBoyId', authenticate, async (req, res) => {
  try {
    const { deliveryBoyId } = req.params;
    
    // Check if user has permission (admin or the delivery boy themselves)
    if (req.user.role !== 'superAdmin' && req.user._id.toString() !== deliveryBoyId) {
      // For customers, check if they have an active order with this delivery boy
      const order = await Order.findOne({
        userId: req.user._id,
        deliveryBoyId: deliveryBoyId,
        orderStatus: { $in: ['Assigned to Delivery Boy', 'Picked Up', 'Out for Delivery'] }
      });

      if (!order) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const location = await DeliveryBoyLocation.findOne({ 
      deliveryBoyId: deliveryBoyId,
      isActive: true 
    }).select('-__v');

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json(location);
  } catch (error) {
    console.error('Get delivery boy location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

