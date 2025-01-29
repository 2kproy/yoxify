// models/channelModel.js
const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['text', 'voice'], default: 'text' },
  // можно хранить темы, описание и т.д.
}, { timestamps: true });

module.exports = mongoose.model('Channel', channelSchema);
