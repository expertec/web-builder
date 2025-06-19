import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Placeholder de autenticación: reemplaza con tu hook/contexto real
function useAuth() {
  // p.ej. return { user: auth.currentUser }
  const user = localStorage.getItem('user'); 
  return { user };
}

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirige a login, guardando la ruta intentada
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
