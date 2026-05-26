/**
 * @file PerfilHeader.jsx
 * @description Componente del encabezado del perfil de usuario.
 * Muestra el nombre del usuario con una insignia de verificado, su rol y ubicación.
 */

import React from 'react';
import { BadgeCheck } from 'lucide-react';

const PerfilHeader = ({ userInfo }) => {
  return (
    <header className="main-header">
      <div className="header-info">
        <h1>
          {userInfo.name}
          <BadgeCheck className="verified-badge" size={28} aria-label="Usuario Verificado" />
        </h1>
        <p className="subtitle">
          {userInfo.role} • {userInfo.location}
        </p>
      </div>
    </header>
  );
};

export default PerfilHeader;
