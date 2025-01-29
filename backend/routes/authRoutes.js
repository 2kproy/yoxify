// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

// Секрет для JWT (в реальном проекте хранить в process.env)
const JWT_SECRET = 'SUPER_SECRET_123'; 

// @route   POST /api/auth/register
// @desc    Регистрация нового пользователя
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Проверка, что все поля заполнены
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Заполните все поля' });
    }

    // Проверка, есть ли уже пользователь с таким email
    const candidate = await User.findOne({ email });
    if (candidate) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const newUser = new User({
      email,
      username,
      password: hashedPassword
    });
    await newUser.save();

    // Можно сразу выдать JWT-токен (автоматически логинить) или заставить логиниться отдельно
    // Здесь покажу, как автоматически логинить:
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'Пользователь создан', 
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// @route   POST /api/auth/login
// @desc    Логин пользователя
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Проверка полей
    if (!email || !password) {
      return res.status(400).json({ message: 'Укажите email и пароль' });
    }

    // Ищем пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Неверные данные для входа (email)' });
    }

    // Сравниваем пароль
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    // Генерируем токен
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      message: 'Успешный вход', 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
