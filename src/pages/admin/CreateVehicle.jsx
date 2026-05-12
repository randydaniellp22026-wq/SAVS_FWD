import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  ArrowLeft, 
  CarFront, 
  Tag, 
  Settings, 
  Fuel, 
  Palette, 
  FileText, 
  Image as ImageIcon, 
  Search,
  Trash2,
  Edit,
  Plus,
  RefreshCcw,
  CheckCircle,
  XCircle
} from 'lucide-react';
import './Admin.css';

const darkSwal = {
  background: '#141414',
  color: '#fff',
  confirmButtonColor: '#eab308',
  cancelButtonColor: '#333'
};

const API_URL = 'http://localhost:5000/vehicles';

const initialFormState = {
  id: '',
  name: '',
  motor: '',
  type: '',
  year: '',
  mileage: '',
  price: '',
  tag: 'Disponible',
  tagColor: '#10b981',
  transmission: 'Automática',
  fuel: 'Gasolina',
  color: '',
  image: '',
  summary: '',
  engine_size: '',
  doors: '',
  drive: '',
  passengers: '',
  steering: '',
  detailImages: []
};

const CreateVehicle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(initialFormState);
  const [vehiculos, setVehiculos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailImagesDraft, setDetailImagesDraft] = useState([]);

  const filteredVehicles = vehiculos.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    // Manejar parámetro de edición desde el dashboard
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    if (editId && vehiculos.length > 0) {
      const v = vehiculos.find(car => car.id === editId);
      if (v) handleEdit(v);
    }
  }, [location.search, vehiculos]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setVehiculos(data.slice().reverse());
      }
    } catch (error) {
      console.error("Error fetching admin vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price' || name === 'year') {
      const cleanValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: cleanValue });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetailImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then(results => {
      setDetailImagesDraft(prev => [...prev, ...results]);
    });
    // Reset input so same files can be re-added if needed
    e.target.value = '';
  };

  const removeDetailImage = (index) => {
    setDetailImagesDraft(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['name', 'motor', 'type', 'year', 'price', 'mileage', 'summary', 'image'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        Swal.fire({
          ...darkSwal,
          icon: 'warning',
          title: 'Campo incompleto',
          text: `El campo ${field} es obligatorio.`
        });
        return;
      }
    }
    // Merge detailImages draft into formData
    const mergedDetailImages = detailImagesDraft.length > 0 ? detailImagesDraft : (formData.detailImages || []);

    const priceNum = Number(formData.price);
    const yearNum = Number(formData.year);

    const cleanData = { ...formData, price: priceNum, year: yearNum, detailImages: mergedDetailImages };

    setLoading(true);
    try {
      if (isEditing) {
        const response = await fetch(`${API_URL}/${cleanData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cleanData)
        });
        if (response.ok) {
          const updated = await response.json();
          setVehiculos(vehiculos.map(v => v.id === updated.id ? updated : v));
          Swal.fire({ ...darkSwal, icon: 'success', title: '¡Actualizado!', timer: 1500, showConfirmButton: false });
          setIsEditing(false);
          setFormData(initialFormState);
          setDetailImagesDraft([]);
        }
      } else {
        const payload = { ...cleanData, id: String(Date.now()) };
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          const newCar = await response.json();
          setVehiculos([newCar, ...vehiculos]);
          Swal.fire({ ...darkSwal, icon: 'success', title: '¡Publicado!', timer: 1500, showConfirmButton: false });
          setFormData(initialFormState);
          setDetailImagesDraft([]);
        }
      }
    } catch (error) {
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Error', text: 'No se pudo guardar.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehiculo) => {
    setIsEditing(true);
    setFormData({
      ...vehiculo,
      price: String(vehiculo.price),
      year: String(vehiculo.year),
      detailImages: vehiculo.detailImages || []
    });
    setDetailImagesDraft(vehiculo.detailImages || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (vehiculo) => {
    Swal.fire({
      ...darkSwal,
      icon: 'warning',
      title: '¿Eliminar vehículo?',
      text: `Esta acción borrará definitivamente el ${vehiculo.name} del catálogo.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(vehiculo.id);
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setVehiculos(prev => prev.filter(v => v.id !== id));
        Swal.fire({ ...darkSwal, icon: 'success', title: 'Eliminado', timer: 1000, showConfirmButton: false });
      }
    } catch (error) {
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Error al eliminar' });
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header inventory-header">
        <div className="header-flex-container">
          <div className="header-text">
            <h1 className="admin-title">Gestión de Inventario SAVS</h1>
            <p className="admin-subtitle">Administra el catálogo de vehículos: añade, edita o elimina unidades.</p>
          </div>
          <button 
            onClick={() => { setIsEditing(false); setFormData(initialFormState); }}
            className="btn-new-record"
          >
            <Plus size={18} /> Nuevo Registro
          </button>
        </div>
      </div>

      <div className="vender-auto-layout">
        
          <div className="form-card-glow">
            <h2 className="form-title">
              {isEditing ? <Edit size={22} className="icon-edit" /> : <Plus size={22} className="icon-new" />}
              {isEditing ? 'Editando Especificaciones' : 'Detalles del Nuevo Vehículo'}
            </h2>
            
            <form className="vender-auto-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label><CarFront size={14} /> Marca y Modelo</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Hyundai Tucson..." />
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label><Settings size={14} /> Motor / Cilindrada</label>
                  <input type="text" name="motor" value={formData.motor} onChange={handleInputChange} placeholder="2000cc" />
                </div>
                <div className="form-group">
                  <label>Estilo</label>
                  <input type="text" name="type" value={formData.type} onChange={handleInputChange} placeholder="SUV, Sedán..." />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Año</label>
                  <input type="text" inputMode="numeric" name="year" value={formData.year} onChange={handleInputChange} placeholder="2024" />
                </div>
                <div className="form-group">
                  <label>Precio Final (CRC)</label>
                  <input type="text" inputMode="numeric" name="price" value={formData.price} onChange={handleInputChange} placeholder="Ej: 15000000" />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label>Transmisión</label>
                  <select name="transmission" value={formData.transmission} onChange={handleInputChange} className="admin-select">
                    <option value="Automática">Automática</option>
                    <option value="Manual">Manual</option>
                    <option value="Dual">Dual</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><Fuel size={14} /> Combustible</label>
                  <select name="fuel" value={formData.fuel} onChange={handleInputChange} className="admin-select">
                    <option value="Diésel">Diésel</option>
                    <option value="Gasolina">Gasolina</option>
                    <option value="Eléctrico">Eléctrico</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label><FileText size={14} /> Descripción de Venta</label>
                <textarea 
                  name="summary" 
                  value={formData.summary} 
                  onChange={handleInputChange} 
                  rows="4"
                  className="admin-textarea"
                />
              </div>

              <div className="form-group">
                <label><ImageIcon size={14} /> Fotografía Principal</label>
                <div className="image-upload-zone">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="file-input-hidden" />
                  {formData.image ? (
                    <img src={formData.image} alt="Upload" className="preview-main-img" />
                  ) : (
                    <div className="upload-placeholder">
                      <ImageIcon size={32} className="upload-icon" />
                      <p>Arrastra o selecciona una imagen</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Galería de Detalles del Vehículo ── */}
              <div className="form-group gallery-section">
                <label className="gallery-label">
                  <ImageIcon size={14} />
                  Galería de Detalles
                  <span className="optional-tag">(opcional — se muestran en el carrusel de la página de detalles)</span>
                </label>

                {/* Zona de carga de múltiples imágenes */}
                <label
                  htmlFor="detail-images-input"
                  className="multi-upload-zone"
                >
                  <ImageIcon size={28} className="multi-upload-icon" />
                  <span className="multi-upload-text">Seleccionar imágenes de detalle</span>
                  <span className="multi-upload-subtext">JPG, PNG, WEBP — puedes seleccionar varias a la vez</span>
                  <input
                    id="detail-images-input"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDetailImagesChange}
                    style={{ display: 'none' }}
                  />
                </label>

                {/* Vista previa de imágenes cargadas */}
                {detailImagesDraft.length > 0 && (
                  <div className="preview-gallery-container">
                    <p className="preview-count-text">
                      {detailImagesDraft.length} imagen{detailImagesDraft.length !== 1 ? 'es' : ''} añadida{detailImagesDraft.length !== 1 ? 's' : ''} — haz clic en la ✕ para eliminar
                    </p>
                    <div className="preview-gallery-grid">
                      {detailImagesDraft.map((src, idx) => (
                        <div
                          key={idx}
                          className="preview-gallery-item"
                        >
                          <img
                            src={src}
                            alt={`Detalle ${idx + 1}`}
                            className="preview-img"
                          />
                          <button
                            type="button"
                            onClick={() => removeDetailImage(idx)}
                            title="Eliminar imagen"
                            className="remove-img-btn"
                          >
                            ✕
                          </button>
                          <div className="img-index-tag">
                            #{idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className={`btn-submit ${isEditing ? 'editing' : 'publishing'}`}>
                {loading ? 'Procesando...' : (isEditing ? <><CheckCircle size={20}/> Guardar Cambios</> : <><Plus size={20}/> Publicar Vehículo</>)}
              </button>
            </form>
          </div>
        {/* Lado derecho: Lista */}
        <div className="vender-auto-list-section">
          <div className="inventory-list-header">
             <h2 className="list-title">Inventario Actual ({vehiculos.length})</h2>
             <div className="search-filter-container">
                <Search size={18} className="search-icon-fixed" />
                <input 
                  type="text" 
                  placeholder="Filtrar por nombre..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-search-input"
                />
             </div>
          </div>

          <div className="admin-scrollable-list inventory-list">
            {filteredVehicles.map(v => (
              <div key={v.id} className="inventory-item">
                <img src={v.image} alt="" className="item-thumbnail" />
                <div className="item-details">
                  <h4 className="item-name">{v.name}</h4>
                  <p className="item-price">₡{Number(v.price).toLocaleString()}</p>
                  <small className="item-meta">{v.year} • {v.fuel}</small>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleEdit(v)} className="btn-icon-sm edit"><Edit size={16}/></button>
                  <button onClick={() => confirmDelete(v)} className="btn-icon-sm delete"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVehicle;
