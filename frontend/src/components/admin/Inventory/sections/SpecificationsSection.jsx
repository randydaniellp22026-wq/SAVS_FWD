import { Settings, Fuel, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SpecificationsSection({ formData, onChange }) {
  return (
    <motion.div
      key="technical"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="form-section-grid"
    >
      <div className="form-input-group">
        <label><Settings size={16} aria-hidden="true" /> Motor / Cilindrada</label>
        <input name="motor" value={formData.motor} onChange={onChange} placeholder="3000cc V6" />
      </div>
      <div className="form-input-group">
        <label><Fuel size={16} aria-hidden="true" /> Combustible</label>
        <select name="fuel" value={formData.fuel} onChange={onChange}>
          <option value="Gasolina">Gasolina</option>
          <option value="Diésel">Diésel</option>
          <option value="Eléctrico">Eléctrico</option>
          <option value="Híbrido">Híbrido</option>
        </select>
      </div>
      <div className="form-input-group">
        <label><Layers size={16} aria-hidden="true" /> Transmisión</label>
        <select name="transmission" value={formData.transmission} onChange={onChange}>
          <option value="Automática">Automática</option>
          <option value="Manual">Manual</option>
          <option value="Dual">Dual</option>
        </select>
      </div>
      <div className="form-input-group">
        <label>Kilometraje</label>
        <input name="mileage" value={formData.mileage} onChange={onChange} placeholder="0 km" />
      </div>
      <div className="form-input-group">
        <label>Puertas</label>
        <input name="doors" value={formData.doors} onChange={onChange} placeholder="5" />
      </div>
      <div className="form-input-group">
        <label>Pasajeros</label>
        <input name="passengers" value={formData.passengers} onChange={onChange} placeholder="7" />
      </div>
    </motion.div>
  );
}
