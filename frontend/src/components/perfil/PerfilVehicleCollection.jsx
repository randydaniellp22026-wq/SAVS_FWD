/**
 * @file PerfilVehicleCollection.jsx
 * @description Componente que visualiza la colección de vehículos del usuario o su lista de favoritos.
 * Permite marcar/desmarcar favoritos y agregar nuevos vehículos del catálogo global.
 */

import React from 'react';
import { Heart, Plus } from 'lucide-react';

const PerfilVehicleCollection = ({
  activeTab,
  displayedVehicles,
  setSelectedVehicle,
  toggleFavorite,
  handleAddVehicle,
}) => {
  return (
    <section className="vehicles-section" aria-labelledby="vehicles-title">
      <h2 id="vehicles-title">{activeTab === 'Favoritos' ? 'Mis Favoritos' : 'Mi Colección'}</h2>
      <div className="vehicles-grid">
        {displayedVehicles.map((vehicle) => (
          <div
            className="vehicle-card"
            key={vehicle.id}
            onClick={() => setSelectedVehicle(vehicle)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedVehicle(vehicle);
              }
            }}
            aria-label={`Ver detalles de ${vehicle.name}`}
          >
            <div className="card-image">
              <img src={vehicle.image} alt={vehicle.name} referrerPolicy="no-referrer" />
              <button
                className="favorite-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(vehicle.id);
                }}
                aria-label={
                  vehicle.isFavorite
                    ? `Quitar ${vehicle.name} de favoritos`
                    : `Agregar ${vehicle.name} a favoritos`
                }
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
              <div className="specs">
                <span>{vehicle.specs}</span>
              </div>
            </div>
          </div>
        ))}

        {activeTab === 'Dashboard' && (
          <div
            className="add-vehicle-card"
            onClick={handleAddVehicle}
            role="button"
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAddVehicle();
              }
            }}
            aria-label="Agregar un vehículo a tu colección"
          >
            <div className="add-content">
              <div className="add-icon">
                <Plus size={36} aria-hidden="true" />
              </div>
              <span>Agregar vehículo</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PerfilVehicleCollection;
