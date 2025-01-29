// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Подставь свой URL ниже
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/yoxify');
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;