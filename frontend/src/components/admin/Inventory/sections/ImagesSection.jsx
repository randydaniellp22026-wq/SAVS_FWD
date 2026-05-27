import { Plus, X } from 'lucide-react';
import { motion } from 'motion/react';

export default function ImagesSection({
  formData,
  detailImages,
  onMainImageChange,
  onDetailImagesChange,
  onRemoveDetailImage,
}) {
  const imageSrc =
    formData.preview ||
    (typeof formData.image === 'string' && formData.image.startsWith('/uploads')
      ? `http://localhost:5000${formData.image}`
      : formData.image);

  return (
    <motion.div
      key="media"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="media-section"
    >
      <div className="main-image-upload">
        <label>Foto de Portada (Principal)</label>
        <div
          className="dropzone-area"
          onClick={() => document.getElementById('main-img-input').click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter') document.getElementById('main-img-input').click();
          }}
          role="button"
          tabIndex={0}
        >
          {formData.preview || formData.image ? (
            <img src={imageSrc} alt="Vista previa del vehículo" className="img-preview-main" />
          ) : (
            <div className="dropzone-placeholder">
              <Plus size={40} aria-hidden="true" />
              <p>Haz clic para subir la imagen principal</p>
            </div>
          )}
          <input
            id="main-img-input"
            type="file"
            hidden
            onChange={onMainImageChange}
            accept="image/*"
          />
        </div>
      </div>

      <div className="detail-images-gallery">
        <label>Galería de Detalles (Carrusel interno)</label>
        <div className="gallery-grid">
          <div
            className="add-gallery-item"
            onClick={() => document.getElementById('gallery-input').click()}
            role="button"
            tabIndex={0}
            aria-label="Añadir imágenes a la galería"
          >
            <Plus size={24} aria-hidden="true" />
            <input
              id="gallery-input"
              type="file"
              hidden
              multiple
              onChange={onDetailImagesChange}
              accept="image/*"
            />
          </div>
          {detailImages.map((img, idx) => (
            <div key={idx} className="gallery-item">
              <img src={img} alt={`Detalle ${idx + 1}`} />
              <button
                type="button"
                onClick={() => onRemoveDetailImage(idx)}
                className="remove-detail-btn"
                aria-label={`Eliminar imagen ${idx + 1}`}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
