// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      console.log('Login response:', response.data);

      // Сохраняем токен
      localStorage.setItem('token', response.data.token);

      // Редиректим на главную
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      // Вывести ошибку в UI
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%', bgcolor: 'background.paper' }}>
        <Typography variant="h5" mb={2} align="center">
          Добро пожаловать в <strong>Yoxify</strong>
        </Typography>
        
        <Box mb={2}>
          <TextField 
            label="Email"
            fullWidth 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField 
            label="Пароль" 
            type="password"
            fullWidth 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
        </Box>

        <Button variant="contained" color="primary" fullWidth sx={{ mb: 1 }} onClick={handleLogin}>
          Войти
        </Button>

        <Typography variant="body2" align="center" sx={{ cursor: 'pointer', mt: 1 }} onClick={goToRegister}>
          Регистрация
        </Typography>
        <Typography variant="body2" align="center" sx={{ cursor: 'pointer', mt: 1 }}>
          Забыли пароль?
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
