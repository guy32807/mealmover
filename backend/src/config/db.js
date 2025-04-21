const mongoose = require('mongoose');

// MongoDB connection URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurant-finder';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    // For development, continue without exiting
    console.log('Continuing without database connection');
  }
};

module.exports = connectDB;