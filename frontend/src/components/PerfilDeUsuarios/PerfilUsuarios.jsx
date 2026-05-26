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
    userInfo,
    userRequests,
    displayedVehicles,
    navigate,
    handleLogout,
    handleUpdateTracking,
    handleEditProfile,
    handleChangePassword,
    handleEditAvatar,
    toggleFavorite,
    handleAddVehicle,
  } = usePerfilLogic();

  if (!userInfo.id) {
    return <CatalogSkeletonGrid count={4} />;
  }

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
          <ul className="sidebar-menu" role="tablist">
            {[
              { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'Favoritos', icon: Heart, label: 'Favoritos' },
              { id: 'Peticiones', icon: FileText, label: 'Estado de Peticiones' },
              { id: 'Estado', icon: Ship, label: 'Estado de importación' },
              { id: 'Configuración', icon: Settings, label: 'Configuración' },
            ].map((tab) => (
              <li
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={activeTab === tab.id ? 'active' : ''}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveTab(tab.id)}
                tabIndex={0}
              >
                <tab.icon size={20} aria-hidden="true" />
                <span>{tab.label}</span>
              </li>
            ))}
            <li className="logout-menu-item" onClick={handleLogout} role="button" tabIndex={0}>
              <LogOut size={20} aria-hidden="true" />
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
            <div className="left-column" role="tabpanel">
              <LoyaltyProgramSection
                activeTab={activeTab}
                userInfo={userInfo}
                displayedVehicles={displayedVehicles}
                onUpdateTracking={handleUpdateTracking}
                onToggleFavorite={toggleFavorite}
                onAddVehicle={handleAddVehicle}
                onSelectVehicle={() => {}}
              />
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
