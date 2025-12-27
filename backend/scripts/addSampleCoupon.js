import mongoose from 'mongoose';
import Coupon from '../models/Coupon.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleCoupon = {
  code: "NEWYEAR26",
  description: "New Year Offer 2026 - Up to 30% OFF on Cakes & Sweets",
  discountType: "percentage",
  discountValue: 30,
  minOrderAmount: 500,
  maxDiscount: 1000,
  validFrom: new Date(),
  validUntil: new Date("2026-12-31"),
  usageLimit: 100,
  isActive: true
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bakehub')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const existing = await Coupon.findOne({ code: sampleCoupon.code });
    
    if (existing) {
      console.log(`⏭️  Coupon ${sampleCoupon.code} already exists`);
      console.log('   To recreate, delete it first from admin panel or database');
      process.exit(0);
    }
    
    const coupon = new Coupon(sampleCoupon);
    await coupon.save();
    
    console.log('✅ Sample coupon created successfully!');
    console.log(`\n📋 Coupon Details:`);
    console.log(`   Code: ${coupon.code}`);
    console.log(`   Discount: ${coupon.discountValue}% (max ₹${coupon.maxDiscount})`);
    console.log(`   Min Order: ₹${coupon.minOrderAmount}`);
    console.log(`   Valid Until: ${coupon.validUntil.toLocaleDateString()}`);
    console.log(`   Usage Limit: ${coupon.usageLimit}`);
    console.log('\n💡 You can use this coupon code during checkout!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });

