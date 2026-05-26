import { Check, Clock, MapPin, Edit2, Heart, Plus } from 'lucide-react';
import styles from './PerfilSections.module.css';

export default function LoyaltyProgramSection({
  activeTab,
  userInfo,
  displayedVehicles,
  onUpdateTracking,
  onToggleFavorite,
  onAddVehicle,
  onSelectVehicle,
}) {
  const showTracking = activeTab === 'Dashboard' || activeTab === 'Estado';
  const showCollection = activeTab === 'Dashboard' || activeTab === 'Favoritos';
  const isAdmin = userInfo.role === 'admin';

  return (
    <>
      {showTracking && (
        <section className="status-section" aria-labelledby="import-status-heading">
          <div className={styles.trackingHeader}>
            <h2 id="import-status-heading" className={styles.trackingTitle}>
              Estado de Importación: {userInfo.tracking?.vehicleName || 'Sin asignar'}
            </h2>
            {isAdmin && (
              <button type="button" className={styles.updateTrackingBtn} onClick={onUpdateTracking}>
                <Edit2 size={16} aria-hidden="true" /> Actualizar Tracking
              </button>
            )}
          </div>
          <div className="progress-container">
            <div className={`progress-step ${userInfo.tracking?.importStatus >= 1 ? 'completed' : ''}`}>
              <div className="step-icon"><Check size={16} aria-hidden="true" /></div>
              <span>Compra realizada</span>
            </div>
            <div className={`progress-line ${userInfo.tracking?.importStatus > 1 ? 'completed' : userInfo.tracking?.importStatus === 1 ? 'active' : ''}`} />
            <div className={`progress-step ${userInfo.tracking?.importStatus >= 2 ? (userInfo.tracking?.importStatus === 2 ? 'active' : 'completed') : ''}`}>
              <div className="step-icon"><Check size={16} aria-hidden="true" /></div>
              <span>En tránsito</span>
            </div>
            <div className={`progress-line ${userInfo.tracking?.importStatus > 2 ? 'completed' : userInfo.tracking?.importStatus === 2 ? 'active' : ''}`} />
            <div className={`progress-step ${userInfo.tracking?.importStatus >= 3 ? (userInfo.tracking?.importStatus === 3 ? 'active' : 'completed') : ''}`}>
              <div className="step-icon"><Clock size={16} aria-hidden="true" /></div>
              <span>En aduanas</span>
            </div>
            <div className={`progress-line ${userInfo.tracking?.importStatus > 3 ? 'completed' : userInfo.tracking?.importStatus === 3 ? 'active' : ''}`} />
            <div className={`progress-step ${userInfo.tracking?.importStatus >= 4 ? 'completed active' : ''}`}>
              <div className="step-icon"><MapPin size={16} aria-hidden="true" /></div>
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
      )}

      {showCollection && (
        <section className="vehicles-section" aria-labelledby="collection-heading">
          <h2 id="collection-heading">{activeTab === 'Favoritos' ? 'Mis Favoritos' : 'Mi Colección'}</h2>
          <div className="vehicles-grid">
            {displayedVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`vehicle-card ${styles.vehicleCardClickable}`}
                onClick={() => onSelectVehicle(vehicle)}
                onKeyDown={(e) => e.key === 'Enter' && onSelectVehicle(vehicle)}
                role="button"
                tabIndex={0}
              >
                <div className="card-image">
                  <img src={vehicle.image} alt={vehicle.name} referrerPolicy="no-referrer" />
                  <button
                    type="button"
                    className="favorite-btn"
                    aria-label={vehicle.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(vehicle.id);
                    }}
                  >
                    <Heart
                      size={20}
                      fill={vehicle.isFavorite ? '#f5b400' : 'rgba(0,0,0,0.5)'}
                      color={vehicle.isFavorite ? '#f5b400' : '#fff'}
                    />
                  </button>
                </div>
                <div className="card-info">
                  <h3>{vehicle.name}</h3>
                  <p className="year">{vehicle.year}</p>
                  <div className="specs"><span>{vehicle.specs}</span></div>
                </div>
              </div>
            ))}
            {activeTab === 'Dashboard' && (
              <div className="add-vehicle-card" onClick={onAddVehicle} role="button" tabIndex={0}>
                <div className="add-content">
                  <div className="add-icon"><Plus size={36} aria-hidden="true" /></div>
                  <span>Agregar vehículo</span>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
