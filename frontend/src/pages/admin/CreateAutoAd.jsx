import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  ChevronRight,
  Loader2,
  CheckCircle,
  ArrowLeft,
  X,
  Plus,
  Save,
  CarFront,
  Tag,
  Settings,
  Layers,
  Calendar,
  Fuel,
  Palette,
  FileText,
  Gauge
} from 'lucide-react';
import { vehicleService } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './CreateAutoAd.css';

// ─── Utilidades ──────────────────────────────────────────────────────────────
const darkSwal = {
  background: '#1a1a1a',
  color: '#fff',
  confirmButtonColor: '#eab308'
};

// ─── Campos que la IA puede detectar ─────────────────────────────────────────
const FIELDS = [
  { key: 'name',           label: 'Nombre del Vehículo',        icon: <CarFront size={15}/>,   type: 'text' },
  { key: 'marca',          label: 'Marca',                      icon: <Tag size={15}/>,         type: 'text' },
  { key: 'modelo',         label: 'Modelo',                     icon: <Settings size={15}/>,   type: 'text' },
  { key: 'type',           label: 'Tipo',                       icon: <Layers size={15}/>,     type: 'select',
    options: ['SUV','Sedán','Hatchback','Pickup','Coupe','Convertible','Van','Crossover'] },
  { key: 'year',           label: 'Año',                        icon: <Calendar size={15}/>,   type: 'number' },
  { key: 'transmission',   label: 'Transmisión',                icon: <Settings size={15}/>,   type: 'select',
    options: ['Manual','Automática'] },
  { key: 'fuel',           label: 'Combustible',                icon: <Fuel size={15}/>,       type: 'select',
    options: ['Gasolina','Diésel','Híbrido','Eléctrico'] },
  { key: 'color',          label: 'Color Exterior',             icon: <Palette size={15}/>,    type: 'text' },
  { key: 'mileage',        label: 'Kilometraje',                icon: <Gauge size={15}/>,      type: 'text' },
  { key: 'price',          label: 'Precio (₡)',                 icon: <Tag size={15}/>,         type: 'number' },
  { key: 'doors',          label: 'Puertas',                    icon: <CarFront size={15}/>,   type: 'text' },
  { key: 'passengers',     label: 'Asientos',                   icon: <CarFront size={15}/>,   type: 'text' },
  { key: 'drive',          label: 'Tracción',                   icon: <Settings size={15}/>,   type: 'text' },
  { key: 'motor',          label: 'Motor',                      icon: <Settings size={15}/>,   type: 'text' },
  { key: 'engine_size',    label: 'Cilindrada',                 icon: <Settings size={15}/>,   type: 'text' },
  { key: 'steering',       label: 'Dirección',                  icon: <Settings size={15}/>,   type: 'text' },
  { key: 'summary',        label: 'Descripción Breve',          icon: <FileText size={15}/>,   type: 'textarea' },
  { key: 'heroSubtitle',   label: 'Subtítulo (Página Detalle)',  icon: <FileText size={15}/>,   type: 'textarea' },
];

// ─── Componente ──────────────────────────────────────────────────────────────
const CreateAutoAd = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState('idle');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [detected, setDetected] = useState({});
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // ── Manejo de archivos ────────────────────────────────────────────────────
  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      Swal.fire({ ...darkSwal, icon: 'warning', title: 'Archivo no válido',
        text: 'Solo se aceptan imágenes (JPG, PNG, WebP, GIF).' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ ...darkSwal, icon: 'warning', title: 'Archivo muy grande',
        text: 'El tamaño máximo es 5 MB.' });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setDragOver(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);
  const onInputChange  = (e) => handleFile(e.target.files?.[0]);

  // ── Analizar imagen con IA ────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!imageFile) return;
    setStep('analyzing');
    try {
      const result = await vehicleService.generateAutoAd(imageFile);
      if (result.success && result.data?.detectedFields) {
        setDetected(result.data.detectedFields);
        setStep('editing');
      } else {
        throw new Error(result.error || 'Sin datos detectados.');
      }
    } catch (err) {
      console.error('Error analizando imagen:', err);
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Error al analizar',
        text: err.message || 'No se pudo extraer la información de la imagen.' });
      setStep('idle');
    }
  };

  // ── Actualizar campo del formulario ───────────────────────────────────────
  const handleFieldChange = (key, value) => {
    setDetected(prev => ({ ...prev, [key]: value }));
  };

  // ── Guardar vehículo ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!detected.name?.trim()) {
      Swal.fire({ ...darkSwal, icon: 'warning', title: 'Nombre requerido',
        text: 'El nombre del vehículo es obligatorio.' });
      return;
    }
    if (!detected.price || Number(detected.price) <= 0) {
      Swal.fire({ ...darkSwal, icon: 'warning', title: 'Precio inválido',
        text: 'Debes ingresar un precio mayor a cero.' });
      return;
    }
    if (!detected.year || Number(detected.year) < 1900 || Number(detected.year) > 2030) {
      Swal.fire({ ...darkSwal, icon: 'warning', title: 'Año inválido',
        text: 'Ingresa un año entre 1900 y 2030.' });
      return;
    }

    setSaving(true);
    try {
      const payload = { ...detected, image: imageFile };
      await vehicleService.create(payload);
      Swal.fire({ ...darkSwal, icon: 'success', title: '¡Anuncio creado!',
        text: 'El vehículo se guardó correctamente en el catálogo.' });
      navigate('/admin');
    } catch (err) {
      console.error('Error guardando vehículo:', err);
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Error al guardar',
        text: err.message || 'No se pudo guardar el vehículo.' });
    } finally {
      setSaving(false);
    }
  };

  // ── Resetear ──────────────────────────────────────────────────────────────
  const handleReset = () => {
    setStep('idle');
    setImageFile(null);
    setImagePreview(null);
    setDetected({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="create-auto-ad-page"
      >
        {/* ── Encabezado ─────────────────────────────────────────────────── */}
        <div className="aad-header">
          <button onClick={() => navigate('/admin')} className="aad-back-btn">
            <ArrowLeft size={18} /> Panel Admin
          </button>
          <h1><Sparkles size={26} /> Generador de Anuncios con IA</h1>
          <p>Sube una foto del vehículo y la IA extraerá automáticamente marca, modelo, año y más datos para publicar en el catálogo.</p>
        </div>

        {/* ── PASO 1: Subida de imagen ───────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {(step === 'idle' || step === 'analyzing') && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="aad-upload-zone"
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={() => !imageFile && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={onInputChange}
                hidden
              />

              {imagePreview ? (
                <div className="aad-preview" onClick={(e) => e.stopPropagation()}>
                  <img src={imagePreview} alt="Vehículo" />
                  <button className="aad-preview-remove" onClick={handleReset}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className={`aad-dropzone ${dragOver ? 'drag-over' : ''}`}>
                  <Upload size={48} />
                  <p className="aad-dropzone-text">
                    Arrastra y suelta la imagen aquí<br />
                    <span>o haz clic para seleccionar</span>
                  </p>
                  <p className="aad-dropzone-hint">JPG · PNG · WebP · GIF — Máx. 5 MB</p>
                </div>
              )}

              {imageFile && !imagePreview && (
                <p className="aad-file-name">
                  <ImageIcon size={14} /> {imageFile.name}
                </p>
              )}

              <button
                className="aad-analyze-btn"
                disabled={!imageFile || step === 'analyzing'}
                onClick={handleAnalyze}
              >
                {step === 'analyzing' ? (
                  <><Loader2 size={18} className="spinner" /> Analizando imagen…</>
                ) : (
                  <><Sparkles size={18} /> Extraer datos con IA</>
                )}
              </button>
            </motion.div>
          )}

          {/* ── PASO 2: Edición de campos ────────────────────────────────── */}
          {step === 'editing' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="aad-editor"
            >
              <div className="aad-editor-header">
                <button onClick={handleReset} className="aad-back-arrow">
                  <ArrowLeft size={18} /> Nueva imagen
                </button>
                <div className="aad-editor-title">
                  <CheckCircle size={22} className="aad-success-icon" />
                  <span>Datos detectados — revisa y completa antes de publicar</span>
                </div>
              </div>

              {imagePreview && (
                <div className="aad-editor-preview">
                  <img src={imagePreview} alt="Vehículo detectado" />
                </div>
              )}

              <div className="aad-fields-grid">
                {FIELDS.map(field => {
                  const value = detected[field.key] ?? '';
                  if (field.type === 'select') {
                    return (
                      <div key={field.key} className="aad-form-group">
                        <label>{field.icon} {field.label}</label>
                        <select
                          value={value}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        >
                          <option value="">— Selecciona —</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (field.type === 'textarea') {
                    return (
                      <div key={field.key} className="aad-form-group full">
                        <label>{field.icon} {field.label}</label>
                        <textarea
                          value={value}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          rows={3}
                          placeholder={`Describe el ${field.label.toLowerCase()}…`}
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={field.key} className="aad-form-group">
                      <label>{field.icon} {field.label}</label>
                      <input
                        type={field.type}
                        value={value}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={`Ej: ${field.key === 'price' ? '45000000'
                          : field.key === 'year' ? String(new Date().getFullYear())
                          : '—'}`}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="aad-editor-actions">
                <button className="aad-btn" onClick={handleReset} disabled={saving}>
                  <ArrowLeft size={18} /> Cancelar
                </button>
                <button
                  className="aad-btn aad-btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? <><Loader2 size={18} className="spinner" /> Guardando…</>
                    : <><Save size={18} /> Publicar en Catálogo</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AdminLayout>
  );
};

export default CreateAutoAd;
