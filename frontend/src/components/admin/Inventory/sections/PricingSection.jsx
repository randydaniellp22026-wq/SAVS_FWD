import { Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PricingSection({ formData, onChange }) {
  return (
    <motion.div
      key="pricing"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="form-section-grid"
    >
      <div className="form-input-group">
        <label><Tag size={16} aria-hidden="true" /> Precio (₡)</label>
        <input
          name="price"
          value={formData.price}
          onChange={onChange}
          placeholder="Ej: 45000000"
          inputMode="numeric"
        />
      </div>
      <div className="form-input-group">
        <label>Año</label>
        <input
          name="year"
          value={formData.year}
          onChange={onChange}
          placeholder="2024"
          inputMode="numeric"
        />
      </div>
    </motion.div>
  );
}
