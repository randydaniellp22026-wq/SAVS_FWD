/**
 * @file PerfilUserInfo.jsx
 * @description Componente lateral que visualiza la información personal del usuario
 * (Email, Teléfono, Ubicación y Dirección exacta).
 * Permite al usuario abrir el formulario interactivo para editar su perfil.
 */

import React from 'react';
import { Mail, Phone, MapPin, Edit2 } from 'lucide-react';

const PerfilUserInfo = ({ userInfo, handleEditProfile }) => {
  return (
    <section className="user-info-section" aria-labelledby="personal-info-title">
      <h2 id="personal-info-title">Información Personal</h2>
      <div className="info-list">
        <div className="info-item">
          <div className="icon-wrapper">
            <Mail className="info-icon" size={20} aria-hidden="true" />
          </div>
          <div className="info-text">
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                letterSpacing: '1px',
                opacity: 0.8,
              }}
            >
              Email
            </span>
            <p>{userInfo.email}</p>
          </div>
        </div>

        <div className="info-item">
          <div className="icon-wrapper">
            <Phone className="info-icon" size={20} aria-hidden="true" />
          </div>
          <div className="info-text">
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                letterSpacing: '1px',
                opacity: 0.8,
              }}
            >
              Teléfono
            </span>
            <p>{userInfo.phone}</p>
          </div>
        </div>

        <div className="info-item">
          <div className="icon-wrapper">
            <MapPin className="info-icon" size={20} aria-hidden="true" />
          </div>
          <div className="info-text">
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                letterSpacing: '1px',
                opacity: 0.8,
              }}
            >
              Ubicación
            </span>
            <p>{userInfo.location}</p>
          </div>
        </div>

        <div className="info-item">
          <div className="icon-wrapper">
            <MapPin className="info-icon" size={20} aria-hidden="true" />
          </div>
          <div className="info-text">
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                letterSpacing: '1px',
                opacity: 0.8,
              }}
            >
              Dirección exacta
            </span>
            <p>{userInfo.preciseAddress}</p>
          </div>
        </div>
      </div>

      <button
        className="edit-profile-btn"
        onClick={handleEditProfile}
        aria-label="Editar información personal del perfil"
      >
        <Edit2 size={18} aria-hidden="true" />
        <span>Editar perfil</span>
      </button>
    </section>
  );
};

export default PerfilUserInfo;
