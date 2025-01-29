// routes/serverRoutes.js (пример)
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Server = require('../models/serverModel');
const User = require('../models/userModel');
const Channel = require('../models/channelModel');

// Создать новый сервер
// POST /api/servers
router.post('/', authMiddleware, async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Не указано название сервера' });
      }
  
      const userId = req.user.userId; // из токена (см. authMiddleware)
  
      // Создаём сервер
      const newServer = new Server({
        name,
        owner: userId,
        members: [userId], // владелец сразу тоже становится участником
      });
      await newServer.save();
  
      res.status(201).json({
        message: 'Сервер создан',
        server: newServer
      });
    } catch (error) {
      console.error('Create server error:', error);
      res.status(500).json({ message: 'Ошибка сервера при создании' });
    }
});
  
// Присоединиться к существующему серверу
// POST /api/servers/join
// На фронте пользователь вводит "ID сервера" (или inviteCode)
router.post('/join', authMiddleware, async (req, res) => {
    try {
      const { serverId } = req.body;
      if (!serverId) {
        return res.status(400).json({ message: 'Не указан ID сервера' });
      }
  
      const userId = req.user.userId;
  
      // Пытаемся найти сервер по _id
      const server = await Server.findById(serverId);
      if (!server) {
        return res.status(404).json({ message: 'Сервер не найден' });
      }
  
      // Проверяем, не состоит ли уже пользователь в этом сервере
      const isMember = server.members.includes(userId);
      if (isMember) {
        return res.status(400).json({ message: 'Вы уже состоите в этом сервере' });
      }
  
      // Добавляем в массив members
      server.members.push(userId);
      await server.save();
  
      res.json({
        message: 'Вы успешно присоединились к серверу',
        server
      });
    } catch (error) {
      console.error('Join server error:', error);
      res.status(500).json({ message: 'Ошибка сервера при присоединении' });
    }
});


//Список серверов
// router.get('/list', authMiddleware, async (req, res) => {
//     try {
//       // Теперь у нас есть req.user
//       // Можем получить userId => req.user.userId
//       // Сходить в базу, вытащить те сервера, которые доступны этому пользователю
  
//       // Заглушка:
//       res.json({ servers: [{ name: 'Test Server 1' }, { name: 'Test Server 2' }] });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Ошибка сервера' });
//     }
// });

// GET /api/servers/list
router.get('/list', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
  
        // Допустим, возвращаем только сервера, где пользователь является членом
        const servers = await Server.find({ members: userId });

        // Возвращает все сервера в базе (без фильтра)
        //const servers = await Server.find({});

        res.json({ servers });
    } catch (error) {
      console.error('Error fetching server list:', error);
      res.status(500).json({ message: 'Ошибка сервера при получении списка' });
    }
});
//  Создание канала POST /api/servers/:serverId/channels
router.post('/:serverId/channels', authMiddleware, async (req, res) => {
    try {
      const { serverId } = req.params;
      const { name, type } = req.body; // type = 'text' | 'voice'
      
      // Проверить, что пользователь состоит на сервере (опционально)
      // const server = await Server.findOne({ _id: serverId, members: req.user.userId });
      // if (!server) return res.status(403).json({ message: 'Нет доступа' });
  
      const channel = new Channel({
        serverId,
        name,
        type
      });
      await channel.save();
  
      res.status(201).json({ channel });
    } catch (err) {
      console.error('Create channel error:', err);
      res.status(500).json({ message: 'Ошибка сервера при создании канала' });
    }
});
  
// Получение листа каналов GET /api/servers/:serverId/channels
router.get('/:serverId/channels', authMiddleware, async (req, res) => {
    try {
      const { serverId } = req.params;
      // Проверяем, состоит ли пользователь в этом сервере (опционально)
      // ...
  
      const channels = await Channel.find({ serverId });
      res.json({ channels });
    } catch (error) {
      console.error('Error fetching channels:', error);
      res.status(500).json({ message: 'Ошибка сервера при получении каналов' });
    }
});

// Редактировать канал PUT /api/servers/:serverId/channels/:channelId
router.put('/:serverId/channels/:channelId', authMiddleware, async (req, res) => {
    try {
      const { serverId, channelId } = req.params;
      const { name } = req.body;
  
      const channel = await Channel.findOne({ _id: channelId, serverId });
      if (!channel) {
        return res.status(404).json({ message: 'Канал не найден' });
      }
  
      channel.name = name || channel.name;
      await channel.save();
  
      res.json({ channel });
    } catch (err) {
      console.error('Update channel error:', err);
      res.status(500).json({ message: 'Ошибка сервера при обновлении канала' });
    }
});

// Удалить канал DELETE /api/servers/:serverId/channels/:channelId
router.delete('/:serverId/channels/:channelId', authMiddleware, async (req, res) => {
    try {
      const { serverId, channelId } = req.params;
      const channel = await Channel.findOneAndDelete({ _id: channelId, serverId });
      if (!channel) {
        return res.status(404).json({ message: 'Канал не найден' });
      }
      res.json({ message: 'Канал удалён' });
    } catch (err) {
      console.error('Delete channel error:', err);
      res.status(500).json({ message: 'Ошибка сервера при удалении канала' });
    }
});
  

router.get('/:serverId', authMiddleware, async (req, res) => {
    try {
      const { serverId } = req.params;
      // Проверка, состоит ли user в этом сервере:
      // const server = await Server.findOne({ _id: serverId, members: req.user.userId });
      
      // Если не надо проверять, возвращай просто findById
      const server = await Server.findById(serverId);
      if (!server) {
        return res.status(404).json({ message: 'Сервер не найден' });
      }
      // Можно проверить, состоит ли пользователь, если сервер приватный...
      // if (!server.members.includes(req.user.userId)) {
      //   return res.status(403).json({ message: 'Нет доступа' });
      // }
  
      // Допустим, у тебя есть поле server.coins = ... (или надо хранить в других моделях)
      res.json({ server });
    } catch (error) {
      console.error('Error fetching server:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
});

router.get('/:serverId/members', authMiddleware, async (req, res) => {
    try {
      const { serverId } = req.params;
      const server = await Server.findById(serverId).populate('members', 'username email');
      if (!server) {
        return res.status(404).json({ message: 'Сервер не найден' });
      }
  
      // Проверяем, что текущий user является членом
      // if (!server.members.some(m => m._id.equals(req.user.userId))) {
      //   return res.status(403).json({ message: 'Нет доступа' });
      // }
  
      // server.members теперь полноценные юзеры (только поля username, email)
      res.json({ members: server.members });
    } catch (error) {
      console.error('Error fetching members:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }  
});
  
module.exports = router;
