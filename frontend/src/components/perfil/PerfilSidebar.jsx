/**
 * @file PerfilSidebar.jsx
 * @description Componente de barra lateral del perfil. Muestra el avatar del usuario,
 * nombre, rol y un menú interactivo para alternar entre diferentes pestañas y cerrar sesión.
 */

import React from 'react';
import {
  LayoutDashboard,
  Heart,
  Clock,
  BadgeCheck,
  FileText,
  Ship,
  Settings,
  LogOut,
  User,
} from 'lucide-react';

const PerfilSidebar = ({ userInfo, activeTab, setActiveTab, handleEditAvatar, handleLogout }) => {
  return (
    <aside className="perfil-sidebar" aria-label="Menú del perfil">
      <div className="sidebar-profile">
        <div
          className="profile-img-container"
          onClick={handleEditAvatar}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
          title="Clic para cambiar foto de perfil"
          role="button"
          tabIndex="0"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleEditAvatar();
            }
          }}
          aria-label="Cambiar foto de perfil"
        >
          {userInfo.image ? (
            <img
              src={userInfo.image}
              alt={`Foto de perfil de ${userInfo.name}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <User size={48} color="#a0a0a0" aria-hidden="true" />
          )}
        </div>
        <h3>{userInfo.name}</h3>
        <span className="profile-role">{userInfo.role}</span>
      </div>

      <ul className="sidebar-menu">
        <li
          className={activeTab === 'Dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('Dashboard')}
          role="menuitem"
          tabIndex="0"
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('Dashboard')}
        >
          <LayoutDashboard size={20} aria-hidden="true" />
          <span>Dashboard</span>
        </li>
        <li
          className={activeTab === 'Favoritos' ? 'active' : ''}
          onClick={() => setActiveTab('Favoritos')}
          role="menuitem"
          tabIndex="0"
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('Favoritos')}
        >
          <Heart
            size={20}
            fill={activeTab === 'Favoritos' ? '#f5b400' : 'none'}
            color={activeTab === 'Favoritos' ? '#f5b400' : 'currentColor'}
            aria-hidden="true"
          />
          <span>Favoritos</span>
        </li>
        <li
          className={activeTab === 'Seguimiento' ? 'active' : ''}
          onClick={() => setActiveTab('Seguimiento')}
          role="menuitem"
          tabIndex="0"
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('Seguimiento')}
        >
          <Clock size={20} aria-hidden="true" />
          <span>Seguimiento</span>
        </li>
        <li
          className={activeTab === 'Puntos' ? 'active' : ''}
          onClick={() => setActiveTab('Puntos')}
          role="menuitem"
          tabIndex="0"
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('Puntos')}
        >
          <BadgeCheck size={20} aria-hidden="true" />
          <span>Puntos</span>
        </li>
        <li
          className={activeTab === 'Peticiones' ? 'active' : ''}
          onClick={() => setActiveTab('Peticiones')}
          role="menuitem"
          tabIndex="0"
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('Peticiones')}
        >
          <FileText size={20} aria-hidden="true" />
          <span>Estado de Peticiones</span>
        </li>
        <li
          className={activeTab === 'Estado' ? 'active' : ''}
          onClick={() => setActiveTab('Estado')}
          role="menuitem"
          tabIndex="0"
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('Estado')}
        >
          <Ship size={20} aria-hidden="true" />
          <span>Estado de importación</span>
        </li>
        <li
          className={activeTab === 'Configuración' ? 'active' : ''}
          onClick={() => setActiveTab('Configuración')}
          role="menuitem"
          tabIndex="0"
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab('Configuración')}
        >
          <Settings size={20} aria-hidden="true" />
          <span>Configuración</span>
        </li>
        <li
          className="logout-menu-item"
          onClick={handleLogout}
          role="menuitem"
          tabIndex="0"
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleLogout()}
        >
          <LogOut size={20} aria-hidden="true" />
          <span>Cerrar Sesión</span>
        </li>
      </ul>
    </aside>
  );
};

export default PerfilSidebar;
