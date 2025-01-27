// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        username,
        password
      });
      
      console.log('Register response:', response.data);

      // Если успешно, например, сохраним token в localStorage
      localStorage.setItem('token', response.data.token);

      // Можно сразу же перекинуть на главную или на логин
      navigate('/');
    } catch (err) {
      console.error('Register error:', err);
      // Можно вывести ошибку в стейт и показать в UI
    }
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
          Регистрация в <strong>Yoxify</strong>
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
            label="Логин"
            fullWidth 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

        <Button variant="contained" color="primary" fullWidth onClick={handleRegister}>
          Зарегистрироваться
        </Button>
        <Typography
            variant="body2"
            align="center"
            sx={{ cursor: 'pointer', mt: 2 }}
            onClick={() => navigate('/login')}
        >
            Войти
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;
