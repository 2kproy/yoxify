// models/messageModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
  channelId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  // Сохраним имя/логин отправителя, чтобы не делать populate (упрощаем)
  username: { type: String, required: true },
  avatarUrl: { type: String, default: '' }, // Ссылка на аватар (если есть)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
