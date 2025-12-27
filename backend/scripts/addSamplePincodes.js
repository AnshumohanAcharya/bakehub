import mongoose from 'mongoose';
import DeliveryPincode from '../models/DeliveryPincode.js';
import dotenv from 'dotenv';

dotenv.config();

const samplePincodes = [
  { pincode: "110001", city: "New Delhi", state: "Delhi", isActive: true },
  { pincode: "110002", city: "New Delhi", state: "Delhi", isActive: true },
  { pincode: "110003", city: "New Delhi", state: "Delhi", isActive: true },
  { pincode: "400001", city: "Mumbai", state: "Maharashtra", isActive: true },
  { pincode: "400002", city: "Mumbai", state: "Maharashtra", isActive: true },
  { pincode: "560001", city: "Bangalore", state: "Karnataka", isActive: true },
  { pincode: "560002", city: "Bangalore", state: "Karnataka", isActive: true },
  { pincode: "700001", city: "Kolkata", state: "West Bengal", isActive: true },
  { pincode: "600001", city: "Chennai", state: "Tamil Nadu", isActive: true },
  { pincode: "380001", city: "Ahmedabad", state: "Gujarat", isActive: true }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bakehub')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    let added = 0;
    let skipped = 0;
    
    for (const pincodeData of samplePincodes) {
      const existing = await DeliveryPincode.findOne({ pincode: pincodeData.pincode });
      
      if (existing) {
        console.log(`⏭️  Pincode ${pincodeData.pincode} already exists, skipping...`);
        skipped++;
        continue;
      }
      
      const pincode = new DeliveryPincode(pincodeData);
      await pincode.save();
      console.log(`✅ Added pincode: ${pincodeData.pincode} - ${pincodeData.city}, ${pincodeData.state}`);
      added++;
    }
    
    console.log(`\n📊 Summary: ${added} added, ${skipped} skipped`);
    console.log('✅ Sample pincodes setup complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });

