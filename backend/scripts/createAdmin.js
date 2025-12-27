import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bakehub')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const adminEmail = 'varunsandeshtalluru@gmail.com';
    
    // Check if user with this email already exists (regardless of role)
    const existingUser = await User.findOne({ 
      email: adminEmail
    });
    
    if (existingUser) {
      // If user exists and is already superAdmin
      if (existingUser.role === 'superAdmin') {
        console.log('✅ Super admin already exists:', existingUser.email);
        console.log('Role:', existingUser.role);
        console.log('Status:', existingUser.isActive ? 'Active' : 'Inactive');
        process.exit(0);
      } else {
        // If user exists but is not superAdmin, update their role
        const previousRole = existingUser.role;
        existingUser.role = 'superAdmin';
        existingUser.isActive = true;
        await existingUser.save();
        console.log('✅ User role updated to superAdmin!');
        console.log('Email:', existingUser.email);
        console.log('Previous Role:', previousRole);
        console.log('New Role: superAdmin');
        console.log('\nYou can now login with this email using OTP authentication.');
        process.exit(0);
      }
    }
    
    // Create new admin if user doesn't exist
    const admin = new User({
      email: adminEmail,
      role: 'superAdmin',
      isActive: true
    });
    
    await admin.save();
    console.log('✅ Super admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('\nYou can now login with this email using OTP authentication.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });

