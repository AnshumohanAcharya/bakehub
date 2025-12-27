import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bakehub';

async function fixCategorySlugIndex() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const categoriesCollection = db.collection('categories');

    // Drop the slug index if it exists
    try {
      await categoriesCollection.dropIndex('slug_1');
      console.log('✓ Dropped slug_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('✓ Index slug_1 does not exist (already removed)');
      } else {
        console.error('Error dropping index:', error.message);
      }
    }

    // List all indexes to verify
    const indexes = await categoriesCollection.indexes();
    console.log('\nCurrent indexes on categories collection:');
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n✓ Fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixCategorySlugIndex();
