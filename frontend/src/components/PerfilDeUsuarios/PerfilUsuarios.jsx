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
      {/* Barra de navegación superior del perfil */}
      <PerfilNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="perfil-body">
        {/* Barra lateral con información rápida del usuario y menú de pestañas */}
        <PerfilSidebar
          userInfo={userInfo}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleEditAvatar={handleEditAvatar}
          handleLogout={handleLogout}
        />

        {/* Sección principal del contenido según la pestaña activa */}
        <main className="perfil-main" id="main-content">
          <PerfilHeader userInfo={userInfo} />

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

              {/* Vista de Solicitudes/Seguimiento */}
              {activeTab === 'Seguimiento' && <PerfilSeguimiento userInfo={userInfo} />}

              {/* Vista de Puntos de Lealtad */}
              {activeTab === 'Puntos' && <PerfilPuntos />}

              {/* Vista del Estado de Peticiones y Respuestas */}
              {activeTab === 'Peticiones' && <PerfilPeticiones userRequests={userRequests} />}

              {/* Ajustes de Configuración de la Cuenta */}
              {activeTab === 'Configuración' && (
                <PerfilSettings
                  handleChangePassword={handleChangePassword}
                  handleLogout={handleLogout}
                />
              )}
            </div>

            {/* Columna Derecha con Información Personal Completa */}
            <div className="right-column">
              <PerfilUserInfo userInfo={userInfo} handleEditProfile={handleEditProfile} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PerfilUsuarios;
