// src/pages/MainApp.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import AddServerModal from '../components/AddServerModal';
import api from '../services/api';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

function MainApp() {
  const [servers, setServers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // При первом рендере — загрузим список серверов (где пользователь член).
  useEffect(() => {
    fetchUserServers();
  }, []);

  const fetchUserServers = async () => {
    try {
      //  endpoint, который возвращает все сервера, в которых состоит текущий пользователь.
      const response = await api.get('/api/servers/list');
      setServers(response.data.servers || []);
    } catch (err) {
      console.error('Error fetching servers:', err);
    }
  };

//   const handleServerClick = (serverId) => {
//     navigate(`/servers/${serverId}`); // Переход на страницу конкретного сервера
//   };
  
  // Когда пользователь успешно создал / подключился к серверу
  const handleServerCreatedOrJoined = (server) => {
    // Можно просто пушнуть в локальный стейт
    setServers((prev) => [...prev, server]);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        height: '100vh', 
        backgroundColor: 'background.default', 
        color: 'text.primary'
      }}
    >
      {/* Левый столбец */}
      <Box 
        sx={{ 
          width: '7vh', 
          backgroundColor: '#1f1f1f',
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          py: 2
        }}
      >
        {/* Список серверов (скругленные квадраты) */}
        {servers.map((srv) => (
        //   <Box key={srv._id} sx={{ mb: 2 }}>
        //     {/* Можно выводить иконку/аватарку, или просто srv.name.substring(0,2)... */}
        //     <Typography variant="body2" align="center">
        //       {srv.name.slice(0,2).toUpperCase()}
        //     </Typography>
        //   </Box>
            <Box 
                key={srv._id} 
                sx={{ mb: 2, cursor: 'pointer' }}
                onClick={() => navigate(`/servers/${srv._id}`)}
                >
                <Typography variant="body2" align="center">
                    {srv.name.slice(0,2).toUpperCase()}
                </Typography>
            </Box>
        ))}

        {/* Кнопка "Создать/Подключиться" (плюс) */}
        
        <IconButton sx={{ mt: 'auto' }} onClick={() => setModalOpen(true)}>
            <AddIcon 
            ariant="contained" 
            color="primary" 
            size="big"
            style={{ backgroundColor: '' }}
            />
        </IconButton>
        {/* <Box sx={{ mt: 'auto' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="small"
            onClick={() => setModalOpen(true)}
          >
            +
          </Button>
        </Box> */}
      </Box>

      {/* Центральная часть: здесь рендерим вложенные маршруты */}
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      {/* Модальное окно "Добавить сервер" */}
      <AddServerModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onServerCreatedOrJoined={handleServerCreatedOrJoined}
      />
    </Box>  
  );
}

export default MainApp;
