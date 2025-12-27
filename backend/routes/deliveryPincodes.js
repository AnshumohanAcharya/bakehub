import express from 'express';
import DeliveryPincode from '../models/DeliveryPincode.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Check pincode (public)
router.post('/check', async (req, res) => {
  try {
    const { pincode } = req.body;

    const pincodeData = await DeliveryPincode.findOne({
      pincode: pincode.trim(),
      isActive: true
    });

    if (pincodeData) {
      res.json({
        available: true,
        message: 'Delivery available',
        pincode: pincodeData.pincode,
        city: pincodeData.city,
        state: pincodeData.state
      });
    } else {
      res.json({
        available: false,
        message: 'Delivery not available for this pincode'
      });
    }
  } catch (error) {
    console.error('Check pincode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
router.get('/', authenticate, authorize('superAdmin'), async (req, res) => {
  try {
    const pincodes = await DeliveryPincode.find().sort({ pincode: 1 });
    res.json(pincodes);
  } catch (error) {
    console.error('Get pincodes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticate, authorize('superAdmin'), async (req, res) => {
  try {
    const pincode = new DeliveryPincode(req.body);
    await pincode.save();
    res.status(201).json(pincode);
  } catch (error) {
    console.error('Create pincode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authenticate, authorize('superAdmin'), async (req, res) => {
  try {
    const pincode = await DeliveryPincode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!pincode) {
      return res.status(404).json({ message: 'Pincode not found' });
    }
    res.json(pincode);
  } catch (error) {
    console.error('Update pincode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authenticate, authorize('superAdmin'), async (req, res) => {
  try {
    const pincode = await DeliveryPincode.findByIdAndDelete(req.params.id);
    if (!pincode) {
      return res.status(404).json({ message: 'Pincode not found' });
    }
    res.json({ message: 'Pincode deleted' });
  } catch (error) {
    console.error('Delete pincode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

