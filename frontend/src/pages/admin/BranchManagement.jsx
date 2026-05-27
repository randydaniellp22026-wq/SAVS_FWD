import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  MapPin,
  Phone,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Map,
  Save,
  X,
  ExternalLink,
} from 'lucide-react';
import { branchesService } from '../../admin/services';
import AdminLoader from '../../components/admin/AdminLoader';
import BranchEditModal from '../../admin/components/BranchManagement/BranchEditModal';
import './Admin.css';

const darkSwal = {
  background: '#111',
  color: '#fff',
  confirmButtonColor: '#eab308',
  cancelButtonColor: '#333',
};

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBranch, setCurrentBranch] = useState({
    id: '',
    name: '',
    location: '',
    phone: '',
    schedule: '',
    map_embed: '',
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const data = await branchesService.getAll();
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBranch({ ...currentBranch, [name]: value });
  };

  const openModal = (branch = null) => {
    if (branch) {
      setCurrentBranch(branch);
      setIsEditing(true);
    } else {
      setCurrentBranch({
        id: 'branch-' + Date.now(),
        name: '',
        location: '',
        phone: '',
        schedule: '',
        map_embed: '',
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentBranch.name || !currentBranch.location) {
      Swal.fire({
        ...darkSwal,
        icon: 'error',
        title: 'Error',
        text: 'Nombre y ubicación son obligatorios.',
      });
      return;
    }

    try {
      if (isEditing) {
        await branchesService.update(currentBranch.id, currentBranch);
      } else {
        await branchesService.create(currentBranch);
      }

      Swal.fire({
        ...darkSwal,
        icon: 'success',
        title: isEditing ? 'Sede Actualizada' : 'Sede Creada',
        timer: 1500,
        showConfirmButton: false,
      });
      fetchBranches();
      closeModal();
    } catch (error) {
      Swal.fire({
        ...darkSwal,
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la sede.',
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      ...darkSwal,
      icon: 'warning',
      title: '¿Eliminar sede?',
      text: 'Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await branchesService.remove(id);
        Swal.fire({
          ...darkSwal,
          icon: 'success',
          title: 'Eliminado',
          timer: 1000,
          showConfirmButton: false,
        });
        fetchBranches();
      } catch (error) {
        Swal.fire({
          ...darkSwal,
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la sede.',
        });
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header-flex">
        <div>
          <h1 className="admin-title">Gestión de Sedes</h1>
          <p className="admin-subtitle">
            Administra los puntos de venta, direcciones y mapas de la empresa.
          </p>
        </div>
        <button className="btn-primary-gold" onClick={() => openModal()}>
          <Plus size={20} />
          <span>Nueva Sede</span>
        </button>
      </div>

      <div className="admin-card branches-mgmt-card">
        {isLoading ? (
          <AdminLoader message="Localizando sedes..." />
        ) : branches.length === 0 ? (
          <div className="empty-state">No hay sedes registradas.</div>
        ) : (
          <div className="branches-admin-grid">
            {branches.map((branch) => (
              <div key={branch.id} className="branch-admin-card">
                <div className="branch-header">
                  <div className="branch-icon-label">
                    <MapPin size={18} color="#eab308" />
                    <h3>{branch.name}</h3>
                  </div>
                  <div className="branch-actions">
                    <button
                      className="btn-icon-sm edit"
                      onClick={() => openModal(branch)}
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-icon-sm delete"
                      onClick={() => handleDelete(branch.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="branch-body">
                  <p className="branch-loc">
                    <strong>Ubicación:</strong> {branch.location}
                  </p>
                  <p className="branch-info">
                    <Phone size={14} /> {branch.phone}
                  </p>
                  <p className="branch-info">
                    <Clock size={14} /> {branch.schedule}
                  </p>
                  {branch.map_embed && (
                    <div className="map-preview-tag">
                      <Map size={14} /> Mapa configurado
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BranchEditModal
        isOpen={showModal}
        isEditing={isEditing}
        currentBranch={currentBranch}
        onClose={closeModal}
        onSave={handleSubmit}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default BranchManagement;
