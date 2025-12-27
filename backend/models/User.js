import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'deliveryBoy', 'superAdmin'],
    default: 'customer'
  },
  name: {
    type: String,
    trim: true
  },
  mobileNumber: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Delivery Boy specific fields
  vehicleType: {
    type: String,
    enum: ['Bike', 'Cycle', 'Car', ''],
    default: ''
  },
  vehicleNumber: {
    type: String,
    default: ''
  },
  area: {
    type: String,
    default: ''
  },
  joinedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);

