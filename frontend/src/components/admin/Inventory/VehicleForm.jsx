import React, { useState } from 'react';
import {
  CarFront,
  Settings,
  Image as ImageIcon,
  CheckCircle,
  X,
  Info,
  Sparkles,
  Loader2,
  DollarSign,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { vehicleService } from '../../../services/api';
import BasicInfoSection from './sections/BasicInfoSection';
import PricingSection from './sections/PricingSection';
import SpecificationsSection from './sections/SpecificationsSection';
import ImagesSection from './sections/ImagesSection';
import './VehicleForm.module.css';

const darkSwal = {
  background: '#1a1a1a',
  color: '#fff',
  confirmButtonColor: '#eab308',
};

const VehicleForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('general');
  const [detailImages, setDetailImages] = useState(initialData.detailImages || []);
  const [aiLoading, setAiLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['price', 'year', 'mileage', 'doors', 'passengers'].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/[^0-9]/g, '') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAiAutofill = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      Swal.fire({ ...darkSwal, icon: 'warning', title: 'Archivo no válido', text: 'Solo imágenes.' });
      return;
    }
    setAiLoading(true);
    try {
      const result = await vehicleService.generateAutoAd(file);
      if (result.success && result.data?.detectedFields) {
        const fields = result.data.detectedFields;
        const previewUrl = URL.createObjectURL(file);
        setFormData((prev) => ({
          ...prev,
          name: fields.name || prev.name || '',
          motor: fields.motor || fields.engine_size || prev.motor || '',
          type: fields.type || prev.type || 'SUV',
          year: fields.year || fields.anio || prev.year || new Date().getFullYear(),
          mileage: fields.mileage || prev.mileage || '',
          price: fields.price || fields.precio || prev.price || '',
          tag: fields.tag || prev.tag || 'Disponible',
          transmission: fields.transmission || prev.transmission || 'Automática',
          fuel: fields.fuel || prev.fuel || 'Gasolina',
          color: fields.color || prev.color || '',
          summary: fields.summary || fields.heroSubtitle || prev.summary || '',
          doors: fields.doors ? String(fields.doors) : prev.doors || '5',
          passengers: fields.passengers ? String(fields.passengers) : prev.passengers || '5',
          image: file,
          preview: previewUrl,
        }));
        Swal.fire({ ...darkSwal, icon: 'success', title: '¡Autocompletado!', timer: 2000, showConfirmButton: false });
      } else {
        throw new Error(result.error || 'Sin datos');
      }
    } catch (err) {
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Error', text: err.message });
    } finally {
      setAiLoading(false);
    }
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file, preview: URL.createObjectURL(file) }));
    }
  };

  const handleDetailImagesChange = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target.result);
            reader.readAsDataURL(file);
          })
      )
    ).then((results) => setDetailImages((prev) => [...prev, ...results]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      Swal.fire({ ...darkSwal, icon: 'warning', title: 'Nombre requerido' });
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      Swal.fire({ ...darkSwal, icon: 'warning', title: 'Precio inválido' });
      return;
    }
    if (!formData.image) {
      Swal.fire({ ...darkSwal, icon: 'warning', title: 'Imagen requerida' });
      return;
    }
    onSubmit({ ...formData, detailImages });
  };

  const tabs = [
    { id: 'general', label: 'Información General', icon: <Info size={18} /> },
    { id: 'pricing', label: 'Precio', icon: <DollarSign size={18} /> },
    { id: 'technical', label: 'Ficha Técnica', icon: <Settings size={18} /> },
    { id: 'media', label: 'Multimedia', icon: <ImageIcon size={18} /> },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inventory-form-card">
      <div className="form-header">
        <div className="header-info">
          <h2>{formData.id ? 'Editar Vehículo' : 'Añadir Nuevo Vehículo'}</h2>
          <p>{formData.id ? `ID: ${formData.id}` : 'Completa los campos para publicar en el catálogo'}</p>
        </div>
        {!formData.id && (
          <div className="headerActions">
            <button
              type="button"
              className="btn-ai-autofill"
              disabled={aiLoading}
              onClick={() => document.getElementById('ai-autofill-input').click()}
            >
              {aiLoading ? (
                <>
                  <Loader2 className="spinner" size={16} /> Analizando...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Rellenar con IA
                </>
              )}
            </button>
            <input id="ai-autofill-input" type="file" hidden onChange={handleAiAutofill} accept="image/*" />
          </div>
        )}
        <button type="button" onClick={onCancel} className="btn-close-form" aria-label="Cerrar formulario">
          <X size={24} />
        </button>
      </div>

      <div className="form-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="premium-admin-form">
        <div className="tab-content" role="tabpanel">
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <BasicInfoSection formData={formData} onChange={handleChange} />
            )}
            {activeTab === 'pricing' && (
              <PricingSection formData={formData} onChange={handleChange} />
            )}
            {activeTab === 'technical' && (
              <SpecificationsSection formData={formData} onChange={handleChange} />
            )}
            {activeTab === 'media' && (
              <ImagesSection
                formData={formData}
                detailImages={detailImages}
                onMainImageChange={handleMainImageChange}
                onDetailImagesChange={handleDetailImagesChange}
                onRemoveDetailImage={(idx) =>
                  setDetailImages((prev) => prev.filter((_, i) => i !== idx))
                }
              />
            )}
          </AnimatePresence>
        </div>

        <div className="form-footer">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className={`btn-save ${loading ? 'loading' : ''}`}>
            {loading ? (
              'Procesando...'
            ) : (
              <>
                <CheckCircle size={18} />
                <span>{formData.id ? 'Guardar Cambios' : 'Publicar Vehículo'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default VehicleForm;
