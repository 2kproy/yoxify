// index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const serverRoutes = require('./routes/serverRoutes');
const Message = require('./models/messageModel');


const JWT_SECRET = 'SUPER_SECRET_123'

// Подключаемся к MongoDB
connectDB();

const app = express();

// Разрешаем CORS (чтобы фронтенд с http://localhost:3000 мог стучаться)
app.use(cors());

// Разбираем JSON из body
app.use(bodyParser.json());

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/servers', serverRoutes);

// Тестовый маршрут
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Создаем http-сервер поверх express
const server = http.createServer(app);

// Создаем io (Socket.IO) поверх server
const io = new Server(server, {
  cors: {
    origin: '*', // или конкретный адрес фронта
  }
});

// МИДЛВАР (middleware) для Socket.IO, который проверяет JWT до события "connection"
io.use((socket, next) => {
  try {
    // token приходит в socket.handshake.auth (или .query) -- зависит от клиента
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('No token provided'));
    }

    // Расшифровываем
    const payload = jwt.verify(token, JWT_SECRET);

    // Сохраняем userId и username в socket (будем использовать потом)
    socket.userId = payload.userId;
    socket.username = payload.username;
    console.log(socket.userId, socket.username);

    next();
  } catch (err) {
    console.warn('Socket JWT Error:', err);
    next(new Error('Authentication error'));
  }
});

// Логика Socket.IO
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}, userId=${socket.userId}, username=${socket.username}`);
  
    // Обработка событий, например, 'joinChannel', 'chatMessage' и т.д.
    socket.on('joinChannel', async ({ channelId }) => {
        socket.join(channelId);
        console.log(`Socket ${socket.id} joined channel ${channelId}`);
        // Можно выслать историю сообщений этому сокету
        try {
         const messages = await Message.find({ channelId }).sort({ createdAt: 1 }).lean();
         socket.emit('channelHistory', messages);
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    });
  
    // Событие "chatMessage": пользователь отправил сообщение
    socket.on('chatMessage', async ({ channelId, avatarUrl, text }) => {
        try {
          const userId = socket.userId;        // из токена
          const username = socket.username;    // из токена
          // Сохраняем сообщение в Mongo
          const newMsg = await Message.create({
              channelId,
              userId, 
              username,
              avatarUrl,
              text,
              createdAt: new Date()
          });

          // Рассылаем всем участникам канала
          io.to(channelId).emit('chatMessage', newMsg);
        } catch (err) {
          console.error('Error saving message:', err);
        }
    });
});
  
// Запускаем сервер
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
