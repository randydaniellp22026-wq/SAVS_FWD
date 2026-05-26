/**
 * @file PerfilUsuarios.jsx
 * @description Componente orquestador del perfil de usuario.
 * Importa y compone los distintos sub-componentes especializados (Navbar, Sidebar,
 * Header, Colección de vehículos, Configuración, etc.) y conecta toda su lógica a través
 * del hook personalizado 'usePerfil'. Cumple con los estándares de descomposición de componentes.
 */

import React from 'react';
import './PerfilUsuarios.css';
import { usePerfil } from '../../hooks/usePerfil';

// Subcomponentes del Perfil
import PerfilNavbar from '../perfil/PerfilNavbar';
import PerfilSidebar from '../perfil/PerfilSidebar';
import PerfilHeader from '../perfil/PerfilHeader';
import PerfilImportStatus from '../perfil/PerfilImportStatus';
import PerfilVehicleCollection from '../perfil/PerfilVehicleCollection';
import PerfilPeticiones from '../perfil/PerfilPeticiones';
import PerfilSettings from '../perfil/PerfilSettings';
import PerfilUserInfo from '../perfil/PerfilUserInfo';

// Secciones adicionales existentes
import PerfilPuntos from './PerfilPuntos';
import PerfilSeguimiento from './PerfilSeguimiento';

import {
  Bell,
  User,
  LayoutDashboard,
  Heart,
  Ship,
  Settings,
  BadgeCheck,
  FileText,
  LogOut,
} from 'lucide-react';
import { CatalogSkeletonGrid } from '../ui/Skeleton';
import { usePerfilLogic } from './usePerfilLogic';
import PersonalDataSection from './sections/PersonalDataSection';
import LoyaltyProgramSection from './sections/LoyaltyProgramSection';
import PurchaseHistorySection from './sections/PurchaseHistorySection';
import AccountSettingsSection from './sections/AccountSettingsSection';
import styles from './sections/PerfilSections.module.css';
import './PerfilUsuarios.css';

function PerfilUsuarios() {
  const {
    activeTab,
    setActiveTab,
    vehicles,
    selectedVehicle,
    setSelectedVehicle,
    userRequests,
    userInfo,
    handleLogout,
    handleUpdateTracking,
    handleEditProfile,
    handleChangePassword,
    handleEditAvatar,
    toggleFavorite,
    handleAddVehicle,
  } = usePerfil();

  // Filtrar vehículos favoritos
  const displayedVehicles =
    activeTab === 'Favoritos' ? vehicles.filter((v) => v.isFavorite) : vehicles;

  return (
    <div className="perfil-container">
      <nav className="perfil-navbar" aria-label="Navegación del perfil">
        <div className="navbar-logo">
          <span className="logo-text">
            DESTINY<span className="gold">VAULT</span>
          </span>
        </div>
        <ul className="navbar-links">
          <li><button type="button" className="nav-link-btn" onClick={() => navigate('/')}>Inicio</button></li>
          <li><button type="button" className="nav-link-btn" onClick={() => navigate('/inventory')}>Vehículos</button></li>
          <li><button type="button" className="nav-link-btn" onClick={() => navigate('/contact')}>Servicios</button></li>
          <li className="active-link">Perfil</li>
        </ul>
        <div className="navbar-icons">
          <button type="button" className="icon-btn" aria-label="Notificaciones"><Bell size={20} /></button>
          <button type="button" className="icon-btn active-icon" aria-label="Perfil activo"><User size={20} /></button>
        </div>
      </nav>

      <div className="perfil-body">
        <aside className="perfil-sidebar" aria-label="Menú del perfil">
          <div className="sidebar-profile">
            <div
              className={`profile-img-container ${styles.profileImgContainer}`}
              onClick={handleEditAvatar}
              onKeyDown={(e) => e.key === 'Enter' && handleEditAvatar()}
              role="button"
              tabIndex={0}
              title="Clic para cambiar foto de perfil"
            >
              {userInfo.image ? (
                <img src={userInfo.image} alt={userInfo.name} className={styles.profileImg} />
              ) : (
                <User size={48} color="#a0a0a0" aria-hidden="true" />
              )}
            </div>
            <h3>{userInfo.name}</h3>
            <span className="profile-role">{userInfo.role}</span>
          </div>
          <ul className="sidebar-menu">
            <li className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => setActiveTab('Dashboard')}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </li>
            <li className={activeTab === 'Favoritos' ? 'active' : ''} onClick={() => setActiveTab('Favoritos')}>
              <Heart size={20} fill={activeTab === 'Favoritos' ? '#f5b400' : 'none'} color={activeTab === 'Favoritos' ? '#f5b400' : 'currentColor'} />
              <span>Favoritos</span>
            </li>
            <li className={activeTab === 'Seguimiento' ? 'active' : ''} onClick={() => setActiveTab('Seguimiento')}>
              <Clock size={20} />
              <span>Seguimiento</span>
            </li>
            <li className={activeTab === 'Puntos' ? 'active' : ''} onClick={() => setActiveTab('Puntos')}>
              <BadgeCheck size={20} />
              <span>Puntos</span>
            </li>
            <li className={activeTab === 'Peticiones' ? 'active' : ''} onClick={() => setActiveTab('Peticiones')}>
              <FileText size={20} />
              <span>Estado de Peticiones</span>
            </li>
            <li className={activeTab === 'Estado' ? 'active' : ''} onClick={() => setActiveTab('Estado')}>
              <Ship size={20} />
              <span>Estado de importación</span>
            </li>
            <li className={activeTab === 'Configuración' ? 'active' : ''} onClick={() => setActiveTab('Configuración')}>
              <Settings size={20} />
              <span>Configuración</span>
            </li>
            <li className="logout-menu-item" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </li>
          </ul>
        </aside>

        <main className="perfil-main">
          <header className="main-header">
            <div className="header-info">
              <h1>
                {userInfo.name}
                <BadgeCheck className="verified-badge" size={28} aria-hidden="true" />
              </h1>
              <p className="subtitle">
                {userInfo.role} • {userInfo.location}
              </p>
            </div>
          </header>

          <div className="content-grid">
            <div className="left-column">
              {/* Vista de Estado/Importación en Dashboard o Estado de importación */}
              {(activeTab === 'Dashboard' || activeTab === 'Estado') && (
                <PerfilImportStatus
                  userInfo={userInfo}
                  handleUpdateTracking={handleUpdateTracking}
                />
              )}

              {/* Vista de Colección o Favoritos */}
              {(activeTab === 'Dashboard' || activeTab === 'Favoritos') && (
                <PerfilVehicleCollection
                  activeTab={activeTab}
                  displayedVehicles={displayedVehicles}
                  setSelectedVehicle={setSelectedVehicle}
                  toggleFavorite={toggleFavorite}
                  handleAddVehicle={handleAddVehicle}
                />
              )}

              {activeTab === 'Puntos' && (
                <PerfilPuntos />
              )}

              {/* Nuevas Peticiones Tab */}
              {activeTab === 'Peticiones' && (
                <PurchaseHistorySection userRequests={userRequests} />
              )}
              {activeTab === 'Configuración' && (
                <AccountSettingsSection
                  onChangePassword={handleChangePassword}
                  onLogout={handleLogout}
                />
              )}
            </div>
            <div className="right-column">
              <PersonalDataSection userInfo={userInfo} onEditProfile={handleEditProfile} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PerfilUsuarios;
