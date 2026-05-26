/**
 * @file PerfilNavbar.jsx
 * @description Componente que renderiza la barra de navegación superior en la vista del perfil de usuario.
 * Proporciona enlaces rápidos a las secciones principales del sitio.
 */

import React from 'react';
import { Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PerfilNavbar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <nav className="perfil-navbar" aria-label="Navegación del perfil">
      <div className="navbar-logo">
        <span className="logo-text">
          DESTINY<span className="gold">VAULT</span>
        </span>
      </div>
      <ul className="navbar-links">
        <li onClick={() => navigate('/')}>Inicio</li>
        <li onClick={() => navigate('/inventory')}>Vehículos</li>
        <li onClick={() => navigate('/contact')}>Servicios</li>
        <li className="active-link" onClick={() => setActiveTab('Dashboard')}>
          Perfil
        </li>
      </ul>
      <div className="navbar-icons">
        <button className="icon-btn" aria-label="Notificaciones">
          <Bell size={20} />
        </button>
        <button className="icon-btn active-icon" aria-label="Perfil de usuario">
          <User size={20} />
        </button>
      </div>
    </nav>
  );
};

export default PerfilNavbar;
