import React, { useState, useEffect } from 'react';
import { X, Save, Car, MapPin, Calendar, Anchor, FileText, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './TrackingEditModal.css';

const TrackingEditModal = ({ isOpen, user, vehicles, onClose, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    vehicleName: '',
    importStatus: 1,
    estimatedDate: '',
    location: '',
    vessel: '',
    statusText: 'Compra procesada correctamente',
  });

  useEffect(() => {
    if (user && user.tracking) {
      setFormData({
        vehicleName: user.tracking.vehicleName || '',
        importStatus: user.tracking.importStatus || 1,
        estimatedDate: user.tracking.estimatedDate || '',
        location: user.tracking.location || '',
        vessel: user.tracking.vessel || '',
        statusText: user.tracking.statusText || 'Compra procesada correctamente',
      });
    } else {
      setFormData({
        vehicleName: '',
        importStatus: 1,
        estimatedDate: '',
        location: '',
        vessel: '',
        statusText: 'Compra procesada correctamente',
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'importStatus' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      <div className="tracking-modal-overlay">
        <motion.div
          className="tracking-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="tracking-modal-header">
            <div>
              <h2>Tracking de Importación</h2>
              <p>Actualizando estado para: <span className="highlight-text">{user?.nombre}</span></p>
            </div>
            <button className="btn-close-modal" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="tracking-modal-body">
            
            <div className="form-group">
              <label><Car size={16} className="input-icon" /> Vehículo Asignado</label>
              <select 
                name="vehicleName" 
                value={formData.vehicleName} 
                onChange={handleChange}
                className="tracking-input"
                required
              >
                <option value="" disabled>-- Seleccione un vehículo disponible --</option>
                {vehicles?.map(v => (
                  <option key={v.id} value={`${v.marca} ${v.modelo}`}>{v.marca} {v.modelo} {v.year ? `(${v.year})` : ''}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label><Activity size={16} className="input-icon" /> Etapa de Importación</label>
              <select 
                name="importStatus" 
                value={formData.importStatus} 
                onChange={handleChange}
                className="tracking-input"
              >
                <option value={1}>1. Compra Realizada</option>
                <option value={2}>2. En Tránsito</option>
                <option value={3}>3. En Aduanas</option>
                <option value={4}>4. Entrega Final</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label><Calendar size={16} className="input-icon" /> Fecha Estimada de Arribo</label>
                <input 
                  type="date" 
                  name="estimatedDate" 
                  value={formData.estimatedDate} 
                  onChange={handleChange}
                  className="tracking-input"
                />
              </div>

              <div className="form-group half">
                <label><Anchor size={16} className="input-icon" /> Barco / Naviera</label>
                <input 
                  type="text" 
                  name="vessel" 
                  value={formData.vessel} 
                  onChange={handleChange}
                  placeholder="Ej: Maersk Line · V0924"
                  className="tracking-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label><MapPin size={16} className="input-icon" /> Ubicación Actual</label>
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange}
                placeholder="Ej: Puerto de Moín, Limón"
                className="tracking-input"
              />
            </div>

            <div className="form-group">
              <label><FileText size={16} className="input-icon" /> Descripción del Estado</label>
              <select 
                name="statusText" 
                value={formData.statusText} 
                onChange={handleChange}
                className="tracking-input"
              >
                <option value="Compra procesada correctamente">Compra procesada correctamente</option>
                <option value="Vehículo en tránsito marítimo">Vehículo en tránsito marítimo</option>
                <option value="En trámite aduanal">En trámite aduanal</option>
                <option value="Listo para entrega al cliente">Listo para entrega al cliente</option>
              </select>
            </div>

            <div className="tracking-modal-footer">
              <button type="button" className="btn-cancel" onClick={onClose} disabled={isSaving}>
                Cancelar
              </button>
              <button type="submit" className="btn-save" disabled={isSaving}>
                {isSaving ? <span className="spin-loader"></span> : <Save size={18} />}
                {isSaving ? 'Guardando...' : 'Guardar Tracking'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TrackingEditModal;
