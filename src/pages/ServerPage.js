// src/pages/ServerPage.js
import React, { useEffect, useState } from 'react';
import {Outlet, useParams, useNavigate} from 'react-router-dom';
import { 
  Box, 
  Typography, 
  IconButton, 
  Drawer, 
  List, 
  ListItemButton, 
  Divider,
  Button 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChannelModal from '../components/ChannelModal';
import ChannelMenu from '../components/ChannelMenu';
import SettingsIcon from '@mui/icons-material/Settings';
import SavingsIcon from '@mui/icons-material/Savings';
import GroupIcon from '@mui/icons-material/Group';
// import ... (другие иконки, если нужны)

import api from '../services/api';
const drawerWidth = 150; // Ширина панели участников
const headerHeight = 3; // Высота шапки (на твой вкус)

function ServerPage() {
  const { serverId } = useParams();
  const navigate = useNavigate();
  const [serverData, setServerData] = useState(null);  // { name, owner, coins... }
  const [anchorEl, setAnchorEl] = useState(null);  // для контекстного меню (троеточие)
  const [channels, setChannels] = useState([]);        // список каналов
  const [selectedChannel, setSelectedChannel] = useState(null); // какой канал кликнули
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [showMembers, setShowMembers] = useState(false); // управление Drawer
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchServerInfo();
    fetchChannels();
    fetchMembers();
  }, [serverId]);

  const fetchServerInfo = async () => {
    try {
      // Предположим, есть GET /api/servers/:serverId (возвращает { name, coins, ... })
      const response = await api.get(`/api/servers/${serverId}`);
      setServerData(response.data.server);
    } catch (error) {
      console.error('Error fetching server data:', error);
    }
  };

  const fetchChannels = async () => {
    try {
      // GET /api/servers/:serverId/channels
      const response = await api.get(`/api/servers/${serverId}/channels`);
      setChannels(response.data.channels || []);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      // GET /api/servers/:serverId/members (надо создать такой роут)
      const response = await api.get(`/api/servers/${serverId}/members`);
      setMembers(response.data.members || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  // При клике на "показать участников" открываем правый Drawer
  const handleToggleMembers = () => {
    setShowMembers((prev) => !prev);
  };

  if (!serverData) {
    return <Box>Загрузка сервера...</Box>;
  }

  // Разделяем каналы на текстовые и голосовые
  const textChannels = channels.filter(ch => ch.type === 'text');
  const voiceChannels = channels.filter(ch => ch.type === 'voice');

    // Открыть модалку "Создать"
    const handleCreateChannel = () => {
        setModalMode('create');
        setSelectedChannel(null);
        setModalOpen(true);
    };

    // Открыть меню (троеточие) возле канала
    const handleOpenMenu = (e, channel) => {
        setAnchorEl(e.currentTarget); // элемент, к которому привязываем меню
        setSelectedChannel(channel);
    };

    // Закрыть меню
    const handleCloseMenu = () => {
        setAnchorEl(null);
        setSelectedChannel(null);
    };

    // Редактировать
    const handleEditChannel = () => {
        handleCloseMenu();
        setModalMode('edit');
        setModalOpen(true);
    };

    // Удалить
    const handleDeleteChannel = async () => {
        try {
            handleCloseMenu();
            if (!selectedChannel) return;
            await api.delete(`/api/servers/${serverId}/channels/${selectedChannel._id}`);
            // После удаления - обновить список
            fetchChannels();
        } catch (err) {
            console.error('Error deleting channel:', err);
        }
    };

    // Когда канал создан или отредактирован - обновим список
        const handleChannelSaved = () => {
        setModalOpen(false);
        fetchChannels();
    };

    return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: 'background.default', 
        color: 'text.primary'
      }}
    >
        {/* Шапка */}
        <Box 
            sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            px: 2, 
            height: `${headerHeight}vh`,
            borderBottom: '1px solid #333',
            backgroundColor: 'background.default', 
            zIndex: (theme) => theme.zIndex.drawer + 1
            }}
        >
            {/* Название сервера */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant="h6">{serverData.name}</Typography>
            {/* количество монет (допустим, serverData.coins) */}
            <Typography variant="body2"> <SavingsIcon sx={{  }}/> {serverData.coins || "no info"}</Typography>
            </Box>
            
            {/* Кнопки справа */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Кнопка "Список участников" */}
            <IconButton onClick={handleToggleMembers}>
                <GroupIcon />
            </IconButton>
            
            {/* Кнопка "Настройки сервера" */}
            <IconButton>
                <SettingsIcon />
            </IconButton>
            </Box>
        </Box>

        {/* Основная часть: слева - каналы, по центру - контент */}
        <Box sx={{ display: 'flex', flex: 1 }}>
            {/* Колонка каналов */}
            <Box 
            sx={{ 
                width: 240, 
                borderRight: '1px solid #333', 
                p: 1 
            }}
            >
            {/* Кнопка "Создать канал" */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Каналы</Typography>
                <button onClick={handleCreateChannel}>+ Канал</button>
            </Box>

            {/* Список каналов */}
            <List dense>
            {channels.map((channel) => (
                <ListItemButton key={channel._id} onClick={() => navigate(`/servers/${serverId}/channel/${channel._id}`)}>
                <Box sx={{ flex: 1 }}>
                    {channel.name} ({channel.type})
                </Box>
                {/* Кнопка-троеточие (иконка), открывающая меню */}
                <IconButton onClick={(e) => handleOpenMenu(e, channel)}>
                    <MoreVertIcon />
                </IconButton>
                </ListItemButton>
            ))}
            </List>

            {/* Меню (ChannelMenu) */}
            <ChannelMenu 
            anchorEl={anchorEl} 
            open={Boolean(anchorEl)} 
            onClose={handleCloseMenu}
            onEdit={handleEditChannel}
            onDelete={handleDeleteChannel}
            />

            {/* Модалка создания/редактирования канала */}
            <ChannelModal
            open={modalOpen}
            mode={modalMode}
            serverId={serverId}
            channel={selectedChannel}
            onClose={() => setModalOpen(false)}
            onSaved={handleChannelSaved}
            />


            {/* Текстовые каналы */}
            <Typography variant="subtitle1" sx={{ px: 1 }}>Текстовые каналы</Typography>
            <List dense>
                {textChannels.map((channel) => (
                    <ListItemButton key={channel._id} onClick={() => navigate(`/servers/${serverId}/channel/${channel._id}`)}>
                     {channel.name}
                    </ListItemButton>
                ))}
            </List>

            <Divider sx={{ my: 1 }} />

            {/* Голосовые каналы */}
            <Typography variant="subtitle1" sx={{ px: 1 }}>Голосовые каналы</Typography>
            <List dense>
                {voiceChannels.map((channel) => (
                <ListItemButton key={channel._id}>
                    {channel.name}
                </ListItemButton>
                ))}
            </List>
            </Box>

            {/* Центральная часть (пока заглушка) */}
            <Box sx={{ 
                flex: 1, 
                p: 2,
                transition: 'margin 0.3s ease',
                marginRight: showMembers ? `${drawerWidth * 1.2}px` : '0px'
                }}>
                <Typography>Добро пожаловать на сервер {serverData.name}!</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Здесь будет чат или что-то ещё...  
                    Можно добавить дополнительные роуты, чтобы при клике на канал открывался соответствующий чат. 
                </Typography>
                <Outlet />
            </Box>
           
            {/* Правая панель (участники) - отображаем только если showMembers */}
            {/* {showMembers && (
            <Box
                    sx={{
                    width: drawerWidth,
                    borderLeft: '1px solid #333',
                    px: 2
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 1 }}>Участники</Typography>
                    {members.map(member => (
                        <Box key={member._id} sx={{ mb: 1 }}>
                        {member.username}
                        </Box>
                    ))}
                </Box>
                )} */}
            
            {/* Drawer (список участников) */}
            <Drawer
                variant="persistent"
                anchor="right"
                open={showMembers}
                onClose={handleToggleMembers}
            
            >
                <Box sx={{ width: drawerWidth, px: 2, paddingTop: `${headerHeight}vh` }}>
                <Typography variant="h6" sx={{ mb: 2}}>Участники</Typography>
                {members.map(member => (
                    <Box key={member._id} sx={{ mb: 1 }}>
                    {member.username}
                    </Box>
                ))}
                </Box>
            </Drawer>
        </Box>

      
    </Box>
  );
}

export default ServerPage;
