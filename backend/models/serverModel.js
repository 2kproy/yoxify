// models/serverModel.js
const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  name: { type: String, required: true },     // Название сервера
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // владелец (User)
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // список участников
  // можно добавить поле "inviteCode" или "description" и т.д.

}, { timestamps: true });

module.exports = mongoose.model('Server', serverSchema);
