// components/ChannelMenu.js
import React from 'react';
import { Menu, MenuItem } from '@mui/material';

function ChannelMenu({ anchorEl, open, onClose, onEdit, onDelete }) {
  return (
    <Menu 
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      <MenuItem onClick={onEdit}>Редактировать</MenuItem>
      <MenuItem onClick={onDelete}>Удалить</MenuItem>
    </Menu>
  );
}

export default ChannelMenu;
