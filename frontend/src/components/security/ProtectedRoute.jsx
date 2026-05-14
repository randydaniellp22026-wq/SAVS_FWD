import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Componente para proteger rutas privadas.
 * Verifica si existe un usuario en sesión y si tiene los permisos necesarios.
 */
const ProtectedRoute = ({ children, allowedRoles = ['admin', 'gerente'] }) => {
  const location = useLocation();
  
  // Obtener usuario del localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // 1. Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Si el rol no está permitido, redirigir al inicio o a una página de "No autorizado"
  if (allowedRoles && !allowedRoles.includes(user.rol?.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  // 3. Si todo está bien, renderizar el contenido protegido
  return children;
};

export default ProtectedRoute;
