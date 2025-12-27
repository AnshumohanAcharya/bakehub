import express from 'express';
import Address from '../models/Address.js';
import { authenticate } from '../middleware/auth.js';
import { geocodeAddress } from '../utils/geocoding.js';

const router = express.Router();

// Get user addresses
router.get('/', authenticate, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id })
      .sort({ isDefault: -1, createdAt: -1 });
    
    // Geocode addresses that don't have location data (in background, don't wait)
    const addressesToGeocode = addresses.filter(
      addr => !addr.location || !addr.location.lat || !addr.location.lng
    );
    
    // Geocode in background without blocking the response
    if (addressesToGeocode.length > 0) {
      Promise.all(addressesToGeocode.map(async (address) => {
        try {
          const location = await geocodeAddress({
            houseNo: address.houseNo,
            street: address.street,
            city: address.city,
            state: address.state,
            pincode: address.pincode
          });
          if (location) {
            await Address.findByIdAndUpdate(address._id, { location });
          }
        } catch (error) {
          console.error(`Error geocoding address ${address._id}:`, error);
        }
      })).catch(err => console.error('Background geocoding error:', err));
    }
    
    res.json(addresses);
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single address
router.get('/:id', authenticate, async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If address doesn't have location data, try to geocode it
    if (!address.location || !address.location.lat || !address.location.lng) {
      const location = await geocodeAddress({
        houseNo: address.houseNo,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode
      });
      if (location) {
        address.location = location;
        await address.save();
      }
    }

    res.json(address);
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create address
router.post('/', authenticate, async (req, res) => {
  try {
    const addressData = {
      ...req.body,
      userId: req.user._id
    };

    // If this is set as default, unset others
    if (req.body.isDefault) {
      await Address.updateMany(
        { userId: req.user._id },
        { $set: { isDefault: false } }
      );
    }

    // Geocode the address to get latitude and longitude
    const location = await geocodeAddress(addressData);
    if (location) {
      addressData.location = location;
    }

    const address = new Address(addressData);
    await address.save();
    res.status(201).json(address);
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update address
router.put('/:id', authenticate, async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If setting as default, unset others
    if (req.body.isDefault) {
      await Address.updateMany(
        { userId: req.user._id, _id: { $ne: req.params.id } },
        { $set: { isDefault: false } }
      );
    }

    // Check if address fields have changed - if so, re-geocode
    const addressFieldsChanged = 
      req.body.houseNo !== address.houseNo ||
      req.body.street !== address.street ||
      req.body.city !== address.city ||
      req.body.state !== address.state ||
      req.body.pincode !== address.pincode;

    if (addressFieldsChanged) {
      // Geocode the updated address
      const location = await geocodeAddress({
        houseNo: req.body.houseNo || address.houseNo,
        street: req.body.street || address.street,
        city: req.body.city || address.city,
        state: req.body.state || address.state,
        pincode: req.body.pincode || address.pincode
      });
      if (location) {
        req.body.location = location;
      }
    }

    Object.assign(address, req.body);
    await address.save();

    res.json(address);
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete address
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ message: 'Address deleted' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

