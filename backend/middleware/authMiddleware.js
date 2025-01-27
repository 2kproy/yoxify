// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Допустим, секрет берем из process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_123';

function authMiddleware(req, res, next) {
  try {
    // Проверяем заголовок Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Не передан заголовок Authorization' });
    }

    // Обычно токен передают как "Bearer <TOKEN>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Токен не найден' });
    }

    // Проверяем валидность
    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded теперь содержит userId / email, которые мы туда положили

    // Привязываем decoded к req, чтобы использовать дальше (к примеру, req.user = { id: decoded.userId }
    req.user = decoded;

    // Идём дальше
    next();
  } catch (error) {
    console.error('authMiddleware error:', error);
    return res.status(401).json({ message: 'Невалидный токен' });
  }
}

module.exports = authMiddleware;
