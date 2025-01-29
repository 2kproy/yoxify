// src/components/RequireAuth.js
import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Данный компонент оборачивает любую страницу, которая должна быть защищена.
 * Он проверяет, есть ли в localStorage сохранённый токен.
 * Если токена нет — редиректит на /login.
 * Если токен есть — рендерит переданный дочерний компонент.
 */
function RequireAuth({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // Если токена нет, отправляем пользователя на страницу логина
    return <Navigate to="/login" replace />;
  }

  // Если токен есть, рендерим вложенные (защищённые) компоненты
  return children;
}

export default RequireAuth;
