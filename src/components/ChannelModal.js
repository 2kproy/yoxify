// components/ChannelModal.js
import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import api from '../services/api';

function ChannelModal({ open, onClose, onSaved, mode, serverId, channel }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('text');

  useEffect(() => {
    if (mode === 'edit' && channel) {
      setName(channel.name);
      setType(channel.type);
    } else {
      setName('');
      setType('text');
    }
  }, [mode, channel]);

  const handleSubmit = async () => {
    try {
      if (mode === 'create') {
        // POST /api/servers/:serverId/channels
        await api.post(`/api/servers/${serverId}/channels`, { name, type });
      } else if (mode === 'edit' && channel) {
        // PUT /api/servers/:serverId/channels/:channelId
        await api.put(`/api/servers/${serverId}/channels/${channel._id}`, { name });
        // Можно также менять type, если хочешь, 
        // но иногда тип канала менять не разрешают (Discord обычно не даёт).
      }
      onSaved(); // сообщаем родителю, что всё ок, надо обновить список
    } catch (err) {
      console.error('Error saving channel:', err);
      // Вывести ошибку пользователю, если надо
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {mode === 'create' ? 'Создать канал' : 'Редактировать канал'}
      </DialogTitle>
      <DialogContent>
        <TextField 
          label="Название канала"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        {/* Тип канала (text/voice) */}
        <FormControl fullWidth>
          <InputLabel id="channel-type-label">Тип канала</InputLabel>
          <Select
            labelId="channel-type-label"
            label="Тип канала"
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={mode === 'edit'} 
            // Или убери disabled, если хочешь позволить изменять тип
          >
            <MenuItem value="text">Текстовый</MenuItem>
            <MenuItem value="voice">Голосовой</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {mode === 'create' ? 'Создать' : 'Сохранить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChannelModal;
