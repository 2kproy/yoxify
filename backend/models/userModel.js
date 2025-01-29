// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Можно добавить поля для профиля:
  // avatar, roles, coins, etc...
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
