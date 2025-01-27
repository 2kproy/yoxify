import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  // Доп. настройки, например, с токеном
  auth: { token: localStorage.getItem('token') },
});

export default socket;
