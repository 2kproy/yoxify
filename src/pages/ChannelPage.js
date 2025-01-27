// // src/pages/ChannelPage.js
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import socket from '../services/socket';

// function ChannelPage() {
//   const { channelId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState('');

//   useEffect(() => {
//     // При монтировании подключаемся к каналу
//     socket.emit('joinChannel', { channelId });

//     // Подписываемся на событие 'chatMessage'
//     socket.on('chatMessage', (msg) => {
//       // Проверяем, что это сообщение для нашего channelId (msg.channelId === channelId)
//       if (msg.channelId === channelId) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });

//     // При размонтировании - отписка
//     return () => {
//       socket.off('chatMessage');
//     };
//   }, [channelId]);

//   const handleSendMessage = () => {
//     if (!inputText.trim()) return;
//     socket.emit('chatMessage', { channelId, text: inputText.trim() });
//     setInputText('');
//   };

//   return (
//     <div>
//       <h2>Channel {channelId}</h2>
//       <div style={{ border: '1px solid #ccc', height: '300px', overflowY: 'auto' }}>
//         {messages.map((m, i) => (
//           <div key={i}>
//             <strong>{m.sender}:</strong> {m.text} <em>({new Date(m.timestamp).toLocaleTimeString()})</em>
//           </div>
//         ))}
//       </div>
//       <input 
//         type="text" 
//         value={inputText}
//         onChange={(e) => setInputText(e.target.value)}
//       />
//       <button onClick={handleSendMessage}>Отправить</button>
//     </div>
//   );
// }

// export default ChannelPage;

// // src/pages/ChatPage.js
// import { useParams } from 'react-router-dom';
// import React, { useEffect, useState, useRef } from 'react';
// import socket from '../services/socket';
// import { Box, Typography, TextField, IconButton, Avatar } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// // Допустим, у нас channelId, userId, username, avatarUrl...

// function ChatPage() {
//     // { channelId, userId, username, avatarUrl }
//     const [messages, setMessages] = useState([]);
//     const [inputValue, setInputValue] = useState('');
//     const { channelId } = useParams();
//     const { userId } = useParams();
//     const { username } = useParams();
//     const { avatarUrl } = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  
//   const messagesEndRef = useRef(null);

//   // Скроллим вниз при каждом рендере
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

//   useEffect(() => {
//     // Присоединяемся к каналу
//     socket.emit('joinChannel', { channelId });

//     // Получаем историю
//     socket.on('channelHistory', (history) => {
//       setMessages(history);
//     });

//     // Получаем новые сообщения
//     socket.on('chatMessage', (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     // Очистка обработчиков при размонтировании
//     return () => {
//       socket.off('channelHistory');
//       socket.off('chatMessage');
//     };
//   }, [channelId]);

//   const handleSendMessage = () => {
//     if (!inputValue.trim()) return;
//     // Отправляем событие на сервер
//     socket.emit('chatMessage', {
//       channelId,
//       userId,
//       username,
//       avatarUrl,   // если есть
//       text: inputValue.trim()
//     });
//     setInputValue('');
//   };

//   // Функция рендеринга сообщений с группировкой
//   const renderMessages = () => {
//     const grouped = [];
//     for (let i = 0; i < messages.length; i++) {
//       const current = messages[i];
//       const prev = i > 0 ? messages[i - 1] : null;

//       // Проверяем, тот ли же пользователь и идут ли подряд
//       const sameUserAsPrev = prev && prev.userId === current.userId;

//       // Если это первое сообщение пользователя после чужого, «начинаем группу»
//       if (!sameUserAsPrev) {
//         grouped.push({
//           _id: current._id, // id первой в группе
//           userId: current.userId,
//           username: current.username,
//           avatarUrl: current.avatarUrl,
//           messages: [current]
//         });
//       } else {
//         // Иначе добавляем в последнюю группу
//         grouped[grouped.length - 1].messages.push(current);
//       }
//     }

//     return grouped.map((grp) => (
//       <Box key={grp._id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
//         {/* Аватарка */}
//         <Avatar
//           src={grp.avatarUrl || ''}
//           alt={grp.username}
//           sx={{ width: 40, height: 40, mr: 1 }}
//         />
//         <Box sx={{ flex: 1 }}>
//           {/* Имя пользователя и время первого сообщения в группе */}
//           <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
//             {grp.username} &nbsp;
//             <Typography component="span" variant="caption" sx={{ color: 'gray' }}>
//               {new Date(grp.messages[0].createdAt).toLocaleTimeString()}
//             </Typography>
//           </Typography>

//           {/* Сами сообщения в группе */}
//           {grp.messages.map((m) => (
//             <Box
//               key={m._id + '_message'} 
//               sx={{ 
//                 backgroundColor: '#2f2f2f', 
//                 borderRadius: 2,
//                 p: 1,
//                 mb: 0.5,
//                 maxWidth: '70%',
//               }}
//             >
//               <Typography variant="body2" sx={{ color: '#fff' }}>
//                 {m.text}
//               </Typography>
//               {/* Время каждого сообщения (если нужно) */}
//               {/* <Typography variant="caption" sx={{ color: 'lightgray' }}>
//                 {new Date(m.createdAt).toLocaleTimeString()}
//               </Typography> */}
//             </Box>
//           ))}
//         </Box>
//       </Box>
//     ));
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 1 }}>
//       {/* Сама зона сообщений */}
//       <Box sx={{ flex: 1, overflowY: 'auto', mb: 1 }}>
//         {renderMessages()}
//         <div ref={messagesEndRef} />
//       </Box>

//       {/* Панель ввода */}
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//         <TextField
//           fullWidth
//           size="small"
//           placeholder="Введите сообщение..."
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyPress={(e) => {
//             if (e.key === 'Enter') handleSendMessage();
//           }}
//         />
//         <IconButton color="primary" onClick={handleSendMessage}>
//           <SendIcon />
//         </IconButton>
//       </Box>
//     </Box>
//   );
// }

// export default ChatPage;

// ChannelPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../services/socket';
import { Box, Typography, Avatar, TextField, Button } from '@mui/material';

function ChannelPage() {
  const { channelId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
//   const { userId } = useParams();
const userId = "6791c80e8d57c6bca1d78f66";
const username = "userId"; 
  console.log(userId, username, channelId);
  

  useEffect(() => {
    // Подключаемся к каналу
    socket.emit('joinChannel', { channelId });

    // Слушаем новое сообщение
    socket.on('chatMessage', (msg) => {
      // Если сообщение для нашего канала - добавляем
      if (msg.channelId === channelId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off('chatMessage');
    };
  }, [channelId]);

  const handleSend = () => {
    if (!text.trim()) return;
    socket.emit('chatMessage', {
        channelId,
        userId,
        username,
        text: text.trim(),
    });
    setText('');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">Канал {channelId}</Typography>

      <Box sx={{ border: '1px solid #ccc', height: 300, overflowY: 'auto', p: 1, mb: 1 }}>
        {messages.map((m, i) => (
          <Box key={i} sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}>
            {/* Аватарка отправителя (пока заглушка) */}
            <Avatar sx={{ mr: 1 }}>{(m.sender || 'U?').slice(0,1)}</Avatar>
            <Box>
              {/* Имя (sender) и время */}
              <Typography variant="subtitle2">
                {m.sender} &nbsp; <span style={{ color: 'gray', fontSize: '0.8rem' }}>
                  {new Date(m.timestamp).toLocaleTimeString()}
                </span>
              </Typography>
              {/* Текст */}
              <Typography>{m.text}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField 
          fullWidth 
          size="small"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
        />
        <Button variant="contained" onClick={handleSend}>Send</Button>
      </Box>
    </Box>
  );
}

export default ChannelPage;
