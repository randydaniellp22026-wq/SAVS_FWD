import React from 'react';
import { X, Save, Building, MapPin, Phone, Clock, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './BranchEditModal.css';

const BranchEditModal = ({ isOpen, isEditing, currentBranch, onClose, onSave, onChange }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="branch-modal-overlay">
        <motion.div
          className="branch-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="branch-modal-header">
            <div>
              <h2>{isEditing ? 'Editar Sede' : 'Nueva Sede'}</h2>
              <p>
                {isEditing 
                  ? 'Actualiza la información de este punto de venta.' 
                  : 'Ingresa los datos para registrar una nueva ubicación.'}
              </p>
            </div>
            <button type="button" className="btn-close-modal" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={onSave} className="branch-modal-body">
            
            <div className="form-group">
              <label><Building size={16} className="input-icon" /> Nombre de la Sede</label>
              <input
                type="text"
                name="name"
                value={currentBranch.name}
                onChange={onChange}
                placeholder="Ej. Sede Central San José"
                className="branch-input"
                required
              />
            </div>

            <div className="form-group">
              <label><MapPin size={16} className="input-icon" /> Dirección Exacta</label>
              <textarea
                name="location"
                value={currentBranch.location}
                onChange={onChange}
                placeholder="Provincia, Cantón, señas exactas..."
                className="branch-input branch-textarea"
                rows="3"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label><Phone size={16} className="input-icon" /> Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  value={currentBranch.phone}
                  onChange={onChange}
                  placeholder="+506 ...."
                  className="branch-input"
                />
              </div>

              <div className="form-group half">
                <label><Clock size={16} className="input-icon" /> Horario</label>
                <input
                  type="text"
                  name="schedule"
                  value={currentBranch.schedule}
                  onChange={onChange}
                  placeholder="L-V 8am-5pm"
                  className="branch-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label><LinkIcon size={16} className="input-icon" /> URL del Mapa (Google Maps Embed)</label>
              <input
                type="text"
                name="map_embed"
                value={currentBranch.map_embed}
                onChange={onChange}
                placeholder="https://www.google.com/maps/embed?..."
                className="branch-input"
              />
              <small className="form-help-text">
                Copia el enlace que está dentro del atributo <code>src="..."</code> en la opción de "Insertar mapa" de Google Maps.
              </small>
            </div>

            <div className="branch-modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-save">
                <Save size={18} />
                {isEditing ? 'Actualizar Sede' : 'Crear Sede'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BranchEditModal;
