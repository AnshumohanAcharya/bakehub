import mongoose from 'mongoose';

const deliveryBoyLocationSchema = new mongoose.Schema({
  deliveryBoyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  heading: {
    type: Number // Direction in degrees (0-360)
  },
  speed: {
    type: Number // Speed in km/h
  },
  accuracy: {
    type: Number // Location accuracy in meters
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create index for efficient queries
deliveryBoyLocationSchema.index({ deliveryBoyId: 1, lastUpdated: -1 });

export default mongoose.model('DeliveryBoyLocation', deliveryBoyLocationSchema);

