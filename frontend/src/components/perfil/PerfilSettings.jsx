/**
 * @file PerfilSettings.jsx
 * @description Componente de configuración de cuenta dentro del perfil de usuario.
 * Proporciona opciones para cambiar contraseñas, definir preferencias de notificaciones,
 * cambiar monedas del catálogo y acceder a la zona de peligro (eliminar cuenta).
 */

import React from 'react';
import Swal from 'sweetalert2';

const darkSwal = {
  background: '#0a0a0a',
  color: '#fff',
  confirmButtonColor: '#eab308',
  cancelButtonColor: '#333',
};

const PerfilSettings = ({ handleChangePassword, handleLogout }) => {
  return (
    <section className="settings-section" aria-labelledby="settings-title">
      <h2 id="settings-title">Ajustes de la Cuenta</h2>
      <div className="settings-grid">
        <div className="settings-card">
          <h3>Seguridad</h3>
          <button
            className="btn-settings outline"
            onClick={handleChangePassword}
            aria-label="Iniciar proceso para cambiar contraseña"
          >
            Cambiar Contraseña
          </button>
        </div>

        <div className="settings-card">
          <h3>Preferencias</h3>
          <div className="toggle-group">
            <label className="toggle-label">
              <input
                type="checkbox"
                defaultChecked
                className="toggle-checkbox"
                aria-label="Recibir notificaciones por Email"
              />{' '}
              Notificaciones por Email
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                defaultChecked
                className="toggle-checkbox"
                aria-label="Recibir alertas por SMS"
              />{' '}
              Alertas SMS
            </label>
          </div>
          <select
            className="settings-select"
            defaultValue="cr"
            aria-label="Seleccionar moneda por defecto"
          >
            <option value="cr">Moneda: Colones (₡)</option>
            <option value="us">Moneda: Dólares ($)</option>
          </select>
        </div>

        <div className="settings-card danger-zone">
          <h3 className="danger-text">Zona de Peligro</h3>
          <p className="danger-desc">Estas acciones no se pueden deshacer.</p>
          <button className="btn-danger" onClick={handleLogout} aria-label="Cerrar sesión actual">
            Cerrar Sesión
          </button>
          <button
            className="btn-danger outline"
            onClick={() =>
              Swal.fire({
                ...darkSwal,
                icon: 'error',
                title: '¿Eliminar cuenta?',
                text: 'Se borrarán de forma permanente todos tus datos, favoritos y autos.',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#e63946',
              })
            }
            aria-label="Eliminar cuenta de forma definitiva"
          >
            Eliminar Cuenta
          </button>
        </div>
      </div>
    </section>
  );
};

export default PerfilSettings;
