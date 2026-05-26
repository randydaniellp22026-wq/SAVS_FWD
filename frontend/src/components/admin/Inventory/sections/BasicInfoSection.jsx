import { CarFront, Tag, Palette, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BasicInfoSection({ formData, onChange }) {
  return (
    <motion.div
      key="general"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="form-section-grid"
    >
      <div className="form-input-group full">
        <label><CarFront size={16} aria-hidden="true" /> Marca y Modelo</label>
        <input
          name="name"
          value={formData.name}
          onChange={onChange}
          placeholder="Ej: Toyota Land Cruiser Prado 2024"
        />
      </div>
      <div className="form-input-group">
        <label>Estado / Etiqueta</label>
        <select name="tag" value={formData.tag} onChange={onChange}>
          <option value="Disponible">Disponible</option>
          <option value="Vendido">Vendido</option>
          <option value="Reservado">Reservado</option>
          <option value="Próximamente">Próximamente</option>
        </select>
      </div>
      <div className="form-input-group">
        <label><Palette size={16} aria-hidden="true" /> Color</label>
        <input
          name="color"
          value={formData.color}
          onChange={onChange}
          placeholder="Gris Metalizado"
        />
      </div>
      <div className="form-input-group full">
        <label><FileText size={16} aria-hidden="true" /> Descripción Breve</label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={onChange}
          rows="3"
          placeholder="Resumen del vehículo para el catálogo..."
        />
      </div>
    </motion.div>
  );
}
