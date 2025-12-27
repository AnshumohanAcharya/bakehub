import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Address from '../models/Address.js';
import { geocodeAddress } from '../utils/geocoding.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const geocodeAllAddresses = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bakehub');
    console.log('Connected to MongoDB');

    // Find all addresses without location data
    const addressesWithoutLocation = await Address.find({
      $or: [
        { 'location.lat': { $exists: false } },
        { 'location.lng': { $exists: false } },
        { 'location.lat': null },
        { 'location.lng': null }
      ]
    });

    console.log(`Found ${addressesWithoutLocation.length} addresses without location data`);

    let successCount = 0;
    let failCount = 0;

    for (const address of addressesWithoutLocation) {
      try {
        console.log(`Geocoding address: ${address.houseNo} ${address.street}, ${address.city}`);
        
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
          console.log(`✓ Geocoded: ${location.lat}, ${location.lng}`);
          successCount++;
        } else {
          console.log(`✗ Failed to geocode address ID: ${address._id}`);
          failCount++;
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error geocoding address ${address._id}:`, error.message);
        failCount++;
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Total addresses: ${addressesWithoutLocation.length}`);
    console.log(`Successfully geocoded: ${successCount}`);
    console.log(`Failed: ${failCount}`);

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

geocodeAllAddresses();

