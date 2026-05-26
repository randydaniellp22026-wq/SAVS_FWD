import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import api, { authService } from '../../services/api';
import { useProfileVehiclesQuery, useProfileRequestsQuery } from '../../hooks/queries/useProfileQuery';

const darkSwal = {
  background: '#0a0a0a',
  color: '#fff',
  confirmButtonColor: '#eab308',
  cancelButtonColor: '#333',
};

export function usePerfilLogic() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [vehicles, setVehicles] = useState([]);
  const [userInfo, setUserInfo] = useState({
    id: null,
    name: '',
    role: 'Cliente',
    email: '',
    phone: '',
    location: '',
    preciseAddress: '',
    image: '',
    tracking: {},
  });

  const { data: catalogData } = useProfileVehiclesQuery(Boolean(userInfo.id));
  const { data: userRequests = [] } = useProfileRequestsQuery(
    userInfo.id,
    userInfo.email,
    Boolean(userInfo.id || userInfo.email)
  );

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      Swal.fire({
        ...darkSwal,
        icon: 'warning',
        title: 'Acceso Denegado',
        text: 'Por favor inicia sesión primero.',
        background: '#141414',
        color: '#fff',
      }).then(() => navigate('/login'));
      return;
    }

    const user = JSON.parse(savedUser);
    setUserInfo({
      id: user.id,
      name: user.nombre || 'Usuario',
      role: user.rol || 'Cliente Premium',
      email: user.email || '',
      phone: user.telefono || '+506 0000 0000',
      location: user.ubicacion || 'San José',
      preciseAddress: user.direccion_precisa || 'Sin dirección registrada',
      image: user.image || '',
      tracking: user.tracking || {
        vehicleName: 'Hyundai Tucson TGDI',
        importStatus: 3,
        estimatedDate: '25 Abr 2026',
        location: 'Puerto de Moín, Limón',
        vessel: 'Maersk Line • V0924',
        statusText: 'En trámite aduanal',
      },
    });
  }, [navigate]);

  useEffect(() => {
    if (!catalogData?.data) return;
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userFavoriteIds = (savedUser.favorites || []).map(String);
    const filtered = catalogData.data
      .filter((v) => userFavoriteIds.includes(String(v.id)))
      .map((v) => ({
        id: v.id,
        name: v.name,
        image: v.image,
        year: v.year?.toString(),
        specs: `${v.motor} • ${v.mileage}`,
        isFavorite: true,
        importStatus: 4,
      }));
    setVehicles(filtered);
  }, [catalogData]);

  const handleLogout = () => {
    Swal.fire({
      ...darkSwal,
      icon: 'warning',
      title: '¿Cerrar Sesión?',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e63946',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await authService.logout();
        } catch (err) {
          console.error(err);
        }
        toast('Sesión cerrada', { icon: '👋' });
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  };

  const handleUpdateTracking = () => {
    const t = userInfo.tracking || {};
    Swal.fire({
      title: 'Actualizar Seguimiento de Importación',
      html: `<div class="swal-tracking-form">
        <input id="track-vehicle" class="swal2-input" value="${t.vehicleName || ''}">
        <select id="track-status" class="swal2-input">
          <option value="1">1. Compra Realizada</option>
          <option value="2">2. En Tránsito</option>
          <option value="3">3. En Aduanas</option>
          <option value="4">4. Entrega Final</option>
        </select>
      </div>`,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      confirmButtonColor: '#eab308',
      background: '#141414',
      color: '#fff',
      preConfirm: () => ({
        vehicleName: document.getElementById('track-vehicle').value,
        importStatus: parseInt(document.getElementById('track-status').value, 10),
        estimatedDate: t.estimatedDate,
        location: t.location,
        vessel: t.vessel,
        statusText: t.statusText,
      }),
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await api.patch(`/users/${userInfo.id}`, { tracking: result.value });
        setUserInfo((prev) => ({ ...prev, tracking: result.value }));
        const savedUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ ...savedUser, tracking: result.value }));
        Swal.fire({ icon: 'success', title: '¡Actualizado!', background: '#141414', color: '#fff' });
      } catch {
        Swal.fire('Error', 'No se pudo actualizar.', 'error');
      }
    });
  };

  const handleEditProfile = () => {
    Swal.fire({
      ...darkSwal,
      title: 'Editar Perfil',
      html: `<input id="swal-input-name" class="swal2-input" value="${userInfo.name}">
             <input id="swal-input-phone" class="swal2-input" value="${userInfo.phone}">`,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      preConfirm: () => ({
        name: document.getElementById('swal-input-name').value.trim(),
        phone: document.getElementById('swal-input-phone').value.trim(),
        location: userInfo.location,
        preciseAddress: userInfo.preciseAddress,
      }),
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      await api.patch(`/users/${userInfo.id}`, {
        nombre: result.value.name,
        telefono: result.value.phone,
      });
      setUserInfo((prev) => ({ ...prev, name: result.value.name, phone: result.value.phone }));
      const sessionUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem(
        'user',
        JSON.stringify({ ...sessionUser, nombre: result.value.name, telefono: result.value.phone })
      );
      Swal.fire({ icon: 'success', title: '¡Actualizado!', background: '#141414', color: '#fff' });
    });
  };

  const handleChangePassword = () => {
    Swal.fire({
      ...darkSwal,
      title: 'Cambiar Contraseña',
      input: 'password',
      showCancelButton: true,
      inputValidator: (v) => (!v || v.length < 8 ? 'Mínimo 8 caracteres' : undefined),
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api.patch(`/users/${userInfo.id}`, { password: result.value });
        Swal.fire({ icon: 'success', title: 'Contraseña actualizada', timer: 2000, showConfirmButton: false });
      }
    });
  };

  const handleEditAvatar = () => {
    Swal.fire({
      ...darkSwal,
      title: 'Actualizar foto de perfil',
      html: '<input type="file" id="avatar-upload" accept="image/*" class="swal2-input">',
      showCancelButton: true,
      preConfirm: () => document.getElementById('avatar-upload').files[0] || false,
    }).then((result) => {
      if (!result.value) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        const newImage = e.target.result;
        setUserInfo((prev) => ({ ...prev, image: newImage }));
        const sessionUser = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ ...sessionUser, image: newImage }));
        try {
          await api.patch(`/users/${userInfo.id}`, { image: newImage });
        } catch (err) {
          console.error(err);
        }
      };
      reader.readAsDataURL(result.value);
    });
  };

  const toggleFavorite = async (vehicleId) => {
    const vidStr = String(vehicleId);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    let updatedFavorites = Array.isArray(user.favorites) ? user.favorites.map(String) : [];
    updatedFavorites = updatedFavorites.includes(vidStr)
      ? updatedFavorites.filter((id) => id !== vidStr)
      : [...updatedFavorites, vidStr];
    await api.patch(`/users/${user.id}`, { favorites: updatedFavorites });
    user.favorites = updatedFavorites;
    localStorage.setItem('user', JSON.stringify(user));
    setVehicles((prev) => prev.filter((v) => String(v.id) !== vidStr));
    toast.success('Favoritos actualizados');
  };

  const handleAddVehicle = () => {
    Swal.fire({ ...darkSwal, icon: 'info', title: 'Agregar desde catálogo', text: 'Visita /inventory para añadir favoritos.' });
  };

  const displayedVehicles =
    activeTab === 'Favoritos' ? vehicles.filter((v) => v.isFavorite) : vehicles;

  return {
    activeTab,
    setActiveTab,
    userInfo,
    userRequests,
    displayedVehicles,
    navigate,
    handleLogout,
    handleUpdateTracking,
    handleEditProfile,
    handleChangePassword,
    handleEditAvatar,
    toggleFavorite,
    handleAddVehicle,
    setSelectedVehicle: () => {},
  };
}
