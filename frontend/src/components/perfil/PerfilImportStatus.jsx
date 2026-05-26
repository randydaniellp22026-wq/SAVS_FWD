/**
 * @file PerfilImportStatus.jsx
 * @description Componente que muestra el estado de importación del vehículo del usuario.
 * Visualiza una línea de progreso interactiva y detalles del arribo/naviera.
 * Permite a los administradores y gerentes actualizar el estado directamente.
 */

import React from 'react';
import { Check, Clock, MapPin, Edit2 } from 'lucide-react';

const PerfilImportStatus = ({ userInfo, handleUpdateTracking }) => {
  const isStaff = userInfo.role === 'admin' || userInfo.role === 'gerente';
  const importStatus = userInfo.tracking?.importStatus ?? 0;

  return (
    <section className="status-section">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <h2 style={{ margin: 0 }}>
          Estado de Importación: {userInfo.tracking?.vehicleName || 'Sin asignar'}
        </h2>
        {isStaff && (
          <button
            onClick={handleUpdateTracking}
            style={{
              background: 'rgba(234,179,8,0.1)',
              color: '#eab308',
              border: '1px solid #eab308',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
            }}
            aria-label="Actualizar estado de seguimiento"
          >
            <Edit2 size={16} aria-hidden="true" /> Actualizar Tracking
          </button>
        )}
      </div>

      <div className="progress-container">
        <div className={`progress-step ${importStatus >= 1 ? 'completed' : ''}`}>
          <div className="step-icon">
            <Check size={16} aria-hidden="true" />
          </div>
          <span>Compra realizada</span>
        </div>
        <div
          className={`progress-line ${importStatus > 1 ? 'completed' : importStatus === 1 ? 'active' : ''}`}
        ></div>

        <div
          className={`progress-step ${importStatus >= 2 ? (importStatus === 2 ? 'active' : 'completed') : ''}`}
        >
          <div className="step-icon">
            <Check size={16} aria-hidden="true" />
          </div>
          <span>En tránsito</span>
        </div>
        <div
          className={`progress-line ${importStatus > 2 ? 'completed' : importStatus === 2 ? 'active' : ''}`}
        ></div>

        <div
          className={`progress-step ${importStatus >= 3 ? (importStatus === 3 ? 'active' : 'completed') : ''}`}
        >
          <div className="step-icon">
            <Clock size={16} aria-hidden="true" />
          </div>
          <span>En aduanas</span>
        </div>
        <div
          className={`progress-line ${importStatus > 3 ? 'completed' : importStatus === 3 ? 'active' : ''}`}
        ></div>

        <div className={`progress-step ${importStatus >= 4 ? 'completed active' : ''}`}>
          <div className="step-icon">
            <MapPin size={16} aria-hidden="true" />
          </div>
          <span>Entrega final</span>
        </div>
      </div>

      <div className="status-details">
        <div className="detail-item">
          <span className="detail-label">Fecha Estimada</span>
          <span className="detail-value">{userInfo.tracking?.estimatedDate || 'TBD'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Ubicación</span>
          <span className="detail-value">{userInfo.tracking?.location || 'TBD'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Vessel / Naviera</span>
          <span className="detail-value">{userInfo.tracking?.vessel || 'TBD'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Estado</span>
          <span className="detail-value">{userInfo.tracking?.statusText || 'Procesando...'}</span>
        </div>
      </div>
    </section>
  );
};

export default PerfilImportStatus;
