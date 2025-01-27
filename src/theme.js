// src/theme.js

import { createTheme } from '@mui/material/styles';

// Цвет "тиффани" обычно где-то в диапазоне #0ABAB5 или #81D8D0, можно варьировать.
const tiffanyColor = '#0ABAB5';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: tiffanyColor
    },
    secondary: {
      main: '#FFFFFF'
    },
    background: {
      default: '#141414',  // фон приложения
      paper: '#1E1E1E'     // фон "карточек"/панелей
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0'
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif'
  },
  // можно добавить свои стили компонентов, если нужно
  components: {
    // Пример переопределения стиля кнопки
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // убираем верхний регистр
          borderRadius: '8px',   // скругленные углы
        },
      },
    },
  },
});

export default theme;