import axios from 'axios';

// Создаём экземпляр axios с настройками
const api = axios.create({
  baseURL: 'http://localhost:5000', // твой бэкенд
});

// Настраиваем интерсептор, чтобы перед каждым запросом проверять localStorage и вставлять заголовок
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
