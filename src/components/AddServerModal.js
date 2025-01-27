// src/components/AddServerModal.js
import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box
} from '@mui/material';
import api from '../services/api'; 
// Это axios-сервис, где настроен baseURL и interceptor (см. предыдущие ответы)

function AddServerModal({ open, onClose, onServerCreatedOrJoined }) {
  // Режим: 'choose' | 'create' | 'join'
  const [mode, setMode] = useState('choose');

  // Для создания сервера
  const [serverName, setServerName] = useState('');

  // Для подключения к серверу
  const [serverId, setServerId] = useState('');

  // Очистка форм при закрытии модалки
  const handleClose = () => {
    setMode('choose');
    setServerName('');
    setServerId('');
    onClose();
  };

  // Создать сервер
  const handleCreateServer = async () => {
    try {
      const response = await api.post('/api/servers', { name: serverName });
      console.log('Server created:', response.data);
      onServerCreatedOrJoined(response.data.server);
      handleClose();
    } catch (error) {
      console.error('Error creating server:', error);
      // Вывести ошибку в UI при необходимости
    }
  };

  // Присоединиться к серверу
  const handleJoinServer = async () => {
    try {
      const response = await api.post('/api/servers/join', { serverId });
      console.log('Joined server:', response.data);
      onServerCreatedOrJoined(response.data.server);
      handleClose();
    } catch (error) {
      console.error('Error joining server:', error);
      // Вывести ошибку в UI при необходимости
    }
  };

  // UI для «предложить выбор»
  if (mode === 'choose') {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Создать или присоединиться к серверу</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Button variant="contained" onClick={() => setMode('create')}>
              Создать сервер
            </Button>
            <Button variant="outlined" onClick={() => setMode('join')}>
              Подключиться к серверу
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // UI для «создать сервер»
  if (mode === 'create') {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Создание сервера</DialogTitle>
        <DialogContent>
          <TextField 
            label="Название сервера" 
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button onClick={() => setMode('choose')}>Назад</Button>
          <Button variant="contained" onClick={handleCreateServer}>Создать</Button>
        </DialogActions>
      </Dialog>
    );
  }

  // UI для «подключиться к серверу»
  if (mode === 'join') {
    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Подключиться к серверу</DialogTitle>
        <DialogContent>
          <TextField 
            label="ID сервера" 
            value={serverId}
            onChange={(e) => setServerId(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Введите идентификатор сервера (MongoDB _id или invite-код).
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button onClick={() => setMode('choose')}>Назад</Button>
          <Button variant="contained" onClick={handleJoinServer}>Подключиться</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return null;
}

export default AddServerModal;
