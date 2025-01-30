// scripts/createIndexes.js
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function createIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create indexes
    await mongoose.connection.collection('users').createIndex({ username: 1 }, { unique: true });
    await mongoose.connection.collection('messages').createIndex({ timestamp: 1 });

    console.log('Indexes created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  }
}

createIndexes();