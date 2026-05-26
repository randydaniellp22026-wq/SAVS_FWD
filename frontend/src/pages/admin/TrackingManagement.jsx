import React, { useState, useMemo } from 'react';
import { Ship } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../services/api';
import { CatalogSkeletonGrid } from '../../components/ui/Skeleton';
import { useTrackingUsersQuery, useInvalidateUsers } from '../../hooks/queries/useUsersQuery';
import TrackingStats from './tracking/TrackingStats';
import TrackingFilters from './tracking/TrackingFilters';
import TrackingHistory from './tracking/TrackingHistory';

const API_URL = '/users';

const TrackingManagement = () => {
  const { data: users = [], isLoading, refetch } = useTrackingUsersQuery();
  const invalidateUsers = useInvalidateUsers();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [stageFilter, setStageFilter] = useState(0);

  const handleEditTracking = (user) => {
    const t = user.tracking || {};
    Swal.fire({
      title: `Tracking: ${user.nombre}`,
      html: `
        <div class="swal-tracking-form">
          <label>Nombre del Vehículo</label>
          <input id="t-vehicle" class="swal2-input" value="${t.vehicleName || ''}">
          <label>Etapa de Importación</label>
          <select id="t-status" class="swal2-input">
            <option value="1" ${t.importStatus === 1 ? 'selected' : ''}>1. Compra Realizada</option>
            <option value="2" ${t.importStatus === 2 ? 'selected' : ''}>2. En Tránsito</option>
            <option value="3" ${t.importStatus === 3 ? 'selected' : ''}>3. En Aduanas</option>
            <option value="4" ${t.importStatus === 4 ? 'selected' : ''}>4. Entrega Final</option>
          </select>
          <label>Fecha Estimada de Arribo</label>
          <input id="t-date" class="swal2-input" value="${t.estimatedDate || ''}" placeholder="Ej: 25 Abr 2026">
          <label>Ubicación Actual</label>
          <input id="t-location" class="swal2-input" value="${t.location || ''}">
          <label>Barco / Naviera</label>
          <input id="t-vessel" class="swal2-input" value="${t.vessel || ''}">
          <label>Descripción del Estado</label>
          <select id="t-text" class="swal2-input">
            <option value="Compra procesada correctamente" ${t.statusText === 'Compra procesada correctamente' ? 'selected' : ''}>Compra procesada correctamente</option>
            <option value="Vehículo en tránsito marítimo" ${t.statusText === 'Vehículo en tránsito marítimo' ? 'selected' : ''}>Vehículo en tránsito marítimo</option>
            <option value="En trámite aduanal" ${t.statusText === 'En trámite aduanal' ? 'selected' : ''}>En trámite aduanal</option>
            <option value="Listo para entrega al cliente" ${t.statusText === 'Listo para entrega al cliente' ? 'selected' : ''}>Listo para entrega al cliente</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#eab308',
      background: '#141414',
      color: '#fff',
      width: '540px',
      preConfirm: () => ({
        vehicleName: document.getElementById('t-vehicle').value.trim(),
        importStatus: parseInt(document.getElementById('t-status').value, 10),
        estimatedDate: document.getElementById('t-date').value.trim(),
        location: document.getElementById('t-location').value.trim(),
        vessel: document.getElementById('t-vessel').value.trim(),
        statusText: document.getElementById('t-text').value,
      }),
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await api.patch(`${API_URL}/${user.id}`, { tracking: result.value });
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          confirmButtonColor: '#eab308',
          background: '#141414',
          color: '#fff',
          timer: 2000,
          showConfirmButton: false,
        });
        invalidateUsers();
        refetch();
        setExpanded(null);
      } catch {
        Swal.fire('Error', 'No se pudo guardar en el servidor.', 'error');
      }
    });
  };

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const matchSearch =
          (u.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
          (u.email || '').toLowerCase().includes(search.toLowerCase());
        const matchStage = stageFilter === 0 || u.tracking?.importStatus === stageFilter;
        return matchSearch && matchStage;
      }),
    [users, search, stageFilter]
  );

  return (
    <div className="admin-container tracking-mgmt">
      <header className="tracking-header">
        <div className="tracking-title-row">
          <div className="tracking-icon-wrapper">
            <Ship size={28} aria-hidden="true" />
          </div>
          <h1 className="admin-title">
            Tracking de <span className="highlight-gold">Importaciones</span>
          </h1>
        </div>
        <p className="admin-subtitle">
          Gestiona y actualiza el estado del proceso de importación de cada cliente.
        </p>
      </header>

      <TrackingStats users={users} />

      <TrackingFilters
        search={search}
        onSearchChange={setSearch}
        stageFilter={stageFilter}
        onStageFilterChange={setStageFilter}
        onRefresh={() => refetch()}
      />

      {isLoading ? (
        <CatalogSkeletonGrid count={4} />
      ) : (
        <TrackingHistory
          users={filtered}
          expanded={expanded}
          onToggleExpand={setExpanded}
          onEditTracking={handleEditTracking}
        />
      )}
    </div>
  );
};

export default TrackingManagement;
