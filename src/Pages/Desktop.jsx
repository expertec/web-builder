import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function Desktop() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Aquí irá tu panel de control “desktop”.</p>
      <Button onClick={logout}>Cerrar Sesión</Button>
    </div>
  );
}
