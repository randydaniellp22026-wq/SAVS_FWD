/**
 * @file usePerfil.js
 * @description Hook personalizado que centraliza el estado y las operaciones CRUD del perfil de usuario.
 * Maneja favoritos, seguimiento de importación, actualización de perfil, avatar, contraseñas y cierre de sesión.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import api, { vehicleService, authService } from '../services/api';

const darkSwal = {
  background: '#0a0a0a',
  color: '#fff',
  confirmButtonColor: '#eab308',
  cancelButtonColor: '#333',
};

export const usePerfil = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [allVehicles, setAllVehicles] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [userRequests, setUserRequests] = useState([]);
  const [userInfo, setUserInfo] = useState({
    id: null,
    name: '',
    role: 'Cliente',
    email: '',
    phone: '',
    location: '',
    preciseAddress: '',
    image: '',
    favorites: [],
    tracking: null,
  });

  const handleLogout = () => {
    Swal.fire({
      ...darkSwal,
      icon: 'warning',
      title: '¿Cerrar Sesión?',
      text: 'Tendrás que ingresar tus credenciales de nuevo.',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      background: '#141414',
      color: '#fff',
      confirmButtonColor: '#e63946',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await authService.logout();
        } catch (err) {
          console.error('Error al cerrar sesión:', err);
        }
        toast('Sesión cerrada', { icon: '👋' });
        localStorage.removeItem('user');
        navigate('/login');
      }
    });
  };

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
        confirmButtonColor: '#f5b400',
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    const fetchAllUserRequests = async (user) => {
      try {
        if (!user.id && !user.email) return;

        const [contactRes, tradeInRes] = await Promise.all([
          api.get('/requests/mine'),
          api.get('/trade-in'),
        ]);

        const filteredContacts = contactRes.data || [];
        const tradeInData = tradeInRes.data || [];

        const normalizedTradeIn = tradeInData.map((item) => ({
          id: item.id,
          subject: `Trade-in: ${item.marca} ${item.modelo}`,
          message: item.descripcion || 'Sin descripción',
          status: item.estado || 'pending',
          date: item.date || new Date().toISOString(),
          reply: item.respuesta_admin || null,
          type: 'tradein',
        }));

        const normalizedContacts = filteredContacts.map((item) => ({
          ...item,
          type: 'contact',
          reply: item.reply || null,
        }));

        const combined = [...normalizedContacts, ...normalizedTradeIn].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setUserRequests(combined);
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };

    const loadData = async () => {
      const user = JSON.parse(savedUser);
      const trackingDefault = user.tracking || {
        vehicleName: 'Hyundai Tucson TGDI',
        importStatus: 3,
        estimatedDate: '25 Abr 2026',
        location: 'Puerto de Moín, Limón',
        vessel: 'Maersk Line • V0924',
        statusText: 'En trámite aduanal',
      };

      setUserInfo({
        id: user.id,
        name: user.nombre || 'Usuario',
        role: user.rol || 'Cliente Premium',
        email: user.email || '',
        phone: user.telefono || '+506 0000 0000',
        location: user.ubicacion || 'San José',
        preciseAddress: user.direccion_precisa || 'Sin dirección registrada',
        image: user.image || '',
        favorites: user.favorites || [],
        tracking: trackingDefault,
      });

      try {
        const response = await vehicleService.getAll();
        const allVehiclesFromDb = response.data || [];
        setAllVehicles(allVehiclesFromDb);

        const userFavoriteIds = (user.favorites || []).map(String);
        const filtered = allVehiclesFromDb
          .filter((v) => userFavoriteIds.includes(String(v.id)))
          .map((v) => ({
            id: v.id,
            name: v.name,
            image: v.image,
            year: v.year.toString(),
            specs: `${v.motor} • ${v.mileage}`,
            isFavorite: true,
            importStatus: 4,
          }));

        setVehicles(filtered);
        if (filtered.length > 0) {
          setSelectedVehicle(filtered[0]);
        }
      } catch (err) {
        console.error('Error cargando favoritos:', err);
      }

      fetchAllUserRequests(user);
    };

    loadData();

    const user = JSON.parse(savedUser);
    const intervalId = setInterval(() => {
      fetchAllUserRequests(user);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  const handleUpdateTracking = () => {
    Swal.fire({
      title: 'Actualizar Seguimiento de Importación',
      html: `
        <div style="text-align: left; color: #fff; overflow: hidden;">
          <label style="display:block; margin-bottom: 5px; font-size: 0.8rem; color: #9ca3af;">Nombre del Vehículo</label>
          <input id="track-vehicle" class="swal2-input" value="${userInfo.tracking?.vehicleName || ''}" style="margin-top:0; margin-bottom:15px; width: 100%; box-sizing: border-box;">
          
          <label style="display:block; margin-bottom: 5px; font-size: 0.8rem; color: #9ca3af;">Etapa de Importación</label>
          <select id="track-status" class="swal2-input" style="margin-top:0; margin-bottom:15px; width: 100%; box-sizing: border-box; background: #222; color: #fff;">
            <option value="1" ${userInfo.tracking?.importStatus === 1 ? 'selected' : ''}>1. Compra Realizada</option>
            <option value="2" ${userInfo.tracking?.importStatus === 2 ? 'selected' : ''}>2. En Tránsito</option>
            <option value="3" ${userInfo.tracking?.importStatus === 3 ? 'selected' : ''}>3. En Aduanas</option>
            <option value="4" ${userInfo.tracking?.importStatus === 4 ? 'selected' : ''}>4. Entrega Final</option>
          </select>

          <label style="display:block; margin-bottom: 5px; font-size: 0.8rem; color: #9ca3af;">Fecha Estimada de Arribo</label>
          <input id="track-date" class="swal2-input" value="${userInfo.tracking?.estimatedDate || ''}" style="margin-top:0; margin-bottom:15px; width: 100%; box-sizing: border-box;">

          <label style="display:block; margin-bottom: 5px; font-size: 0.8rem; color: #9ca3af;">Ubicación Actual</label>
          <input id="track-location" class="swal2-input" value="${userInfo.tracking?.location || ''}" style="margin-top:0; margin-bottom:15px; width: 100%; box-sizing: border-box;">

          <label style="display:block; margin-bottom: 5px; font-size: 0.8rem; color: #9ca3af;">Barco / Naviera</label>
          <input id="track-vessel" class="swal2-input" value="${userInfo.tracking?.vessel || ''}" style="margin-top:0; margin-bottom:15px; width: 100%; box-sizing: border-box;">

          <label style="display:block; margin-bottom: 5px; font-size: 0.8rem; color: #9ca3af;">Descripción del Estado</label>
          <select id="track-text" class="swal2-input" style="margin-top:0; margin-bottom:5px; width: 100%; box-sizing: border-box; background: #222; color: #fff;">
            <option value="Compra procesada correctamente" ${userInfo.tracking?.statusText === 'Compra procesada correctamente' ? 'selected' : ''}>Compra procesada correctamente</option>
            <option value="Vehículo en tránsito marítimo" ${userInfo.tracking?.statusText === 'Vehículo en tránsito marítimo' ? 'selected' : ''}>Vehículo en tránsito marítimo</option>
            <option value="En trámite aduanal" ${userInfo.tracking?.statusText === 'En trámite aduanal' ? 'selected' : ''}>En trámite aduanal</option>
            <option value="Listo para entrega al cliente" ${userInfo.tracking?.statusText === 'Listo para entrega al cliente' ? 'selected' : ''}>Listo para entrega al cliente</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#eab308',
      background: '#141414',
      color: '#fff',
      width: '520px',
      preConfirm: () => {
        return {
          vehicleName: document.getElementById('track-vehicle').value,
          importStatus: parseInt(document.getElementById('track-status').value),
          estimatedDate: document.getElementById('track-date').value,
          location: document.getElementById('track-location').value,
          vessel: document.getElementById('track-vessel').value,
          statusText: document.getElementById('track-text').value,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api.patch(`/users/${userInfo.id}`, { tracking: result.value });

          if (res.status === 200) {
            setUserInfo((prev) => ({ ...prev, tracking: result.value }));

            const savedUser = JSON.parse(localStorage.getItem('user'));
            savedUser.tracking = result.value;
            localStorage.setItem('user', JSON.stringify(savedUser));

            Swal.fire({
              title: '¡Actualizado!',
              text: 'La información de seguimiento se ha actualizado correctamente.',
              icon: 'success',
              confirmButtonColor: '#eab308',
              background: '#141414',
              color: '#fff',
            });
          }
        } catch (error) {
          console.error('Error updating tracking:', error);
          Swal.fire('Error', 'No se pudo actualizar la información en el servidor.', 'error');
        }
      }
    });
  };

  const handleEditProfile = () => {
    Swal.fire({
      ...darkSwal,
      title: 'Editar Perfil',
      html: `
        <div style="text-align: left; margin-bottom: 20px;">
          <div style="margin-bottom: 8px;"><label style="font-size: 14px; color: #a0a0a0;">Nombre Completo</label></div>
          <input id="swal-input-name" class="swal2-input" value="${userInfo.name}" style="margin: 0; width: 90%;">
        </div>
        <div style="text-align: left; margin-bottom: 20px;">
          <div style="margin-bottom: 8px;"><label style="font-size: 14px; color: #a0a0a0;">Teléfono</label></div>
          <input id="swal-input-phone" type="text" class="swal2-input" value="${userInfo.phone}" placeholder="Ej: +506 72617462" style="margin: 0; width: 90%;">
        </div>
        <div style="text-align: left; margin-bottom: 20px;">
          <div style="margin-bottom: 8px;"><label style="font-size: 14px; color: #a0a0a0;">Provincia (Costa Rica)</label></div>
          <select id="swal-input-location" class="swal2-input" style="margin: 0; width: 90%; color: #fff; background: #222;">
            <option value="San José" ${userInfo.location === 'San José' ? 'selected' : ''}>San José</option>
            <option value="Alajuela" ${userInfo.location === 'Alajuela' ? 'selected' : ''}>Alajuela</option>
            <option value="Cartago" ${userInfo.location === 'Cartago' ? 'selected' : ''}>Cartago</option>
            <option value="Heredia" ${userInfo.location === 'Heredia' ? 'selected' : ''}>Heredia</option>
            <option value="Guanacaste" ${userInfo.location === 'Guanacaste' ? 'selected' : ''}>Guanacaste</option>
            <option value="Puntarenas" ${userInfo.location === 'Puntarenas' ? 'selected' : ''}>Puntarenas</option>
            <option value="Limón" ${userInfo.location === 'Limón' ? 'selected' : ''}>Limón</option>
          </select>
        </div>
        <div style="text-align: left;">
          <div style="margin-bottom: 8px;"><label style="font-size: 14px; color: #a0a0a0;">Dirección Precisa</label></div>
          <input id="swal-input-address" class="swal2-input" placeholder="Ej: 125m oeste de..." value="${userInfo.preciseAddress === 'Sin dirección registrada' ? '' : userInfo.preciseAddress}" style="margin: 0; width: 90%;">
        </div>
      `,
      background: '#141414',
      color: '#fff',
      confirmButtonColor: '#f5b400',
      confirmButtonText: 'Guardar Cambios',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('swal-input-name').value.trim();
        const phone = document.getElementById('swal-input-phone').value.trim();
        const location = document.getElementById('swal-input-location').value;
        const preciseAddress = document.getElementById('swal-input-address').value.trim();

        if (!name || !phone || !location) {
          Swal.showValidationMessage('Los campos destacados son obligatorios.');
          return false;
        }

        const regexName = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;
        if (!regexName.test(name)) {
          Swal.showValidationMessage(
            'El nombre debe tener al menos 3 caracteres y contener solo letras.'
          );
          return false;
        }

        const regexPhone = /^[0-9+\s\-()]{8,20}$/;
        if (!regexPhone.test(phone)) {
          Swal.showValidationMessage(
            'Asegúrate de incluir el código de país con un espacio, ej: +506 72617462.'
          );
          return false;
        }

        return { name, phone, location, preciseAddress };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.patch(`/users/${userInfo.id}`, {
            nombre: result.value.name,
            telefono: result.value.phone,
            ubicacion: result.value.location,
            direccion_precisa: result.value.preciseAddress,
          });

          const updatedUser = { ...userInfo, ...result.value };
          setUserInfo(updatedUser);

          const sessionUser = JSON.parse(localStorage.getItem('user'));
          localStorage.setItem(
            'user',
            JSON.stringify({
              ...sessionUser,
              nombre: result.value.name,
              telefono: result.value.phone,
              ubicacion: result.value.location,
              direccion_precisa: result.value.preciseAddress,
            })
          );

          Swal.fire({
            ...darkSwal,
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Tus datos han sido guardados permanentemente.',
            background: '#141414',
            color: '#fff',
            confirmButtonColor: '#f5b400',
          });
        } catch (err) {
          Swal.fire({ ...darkSwal, icon: 'error', title: 'Oops...', text: err.message });
        }
      }
    });
  };

  const handleChangePassword = () => {
    Swal.fire({
      ...darkSwal,
      title: 'Cambiar Contraseña',
      text: 'Ingresa tu nueva contraseña (mínimo 8 caracteres):',
      input: 'password',
      inputPlaceholder: 'Nueva contraseña',
      showCancelButton: true,
      confirmButtonText: 'Actualizar Contraseña',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value || value.length < 8) {
          return 'La contraseña debe tener al menos 8 caracteres.';
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api.patch(`/users/${userInfo.id}`, { password: result.value });

          if (res.status === 200) {
            Swal.fire({
              ...darkSwal,
              icon: 'success',
              title: '¡Éxito!',
              text: 'Tu contraseña ha sido actualizada correctamente.',
              timer: 2000,
              showConfirmButton: false,
            });
          } else {
            throw new Error('No se pudo actualizar la contraseña.');
          }
        } catch (error) {
          Swal.fire({ ...darkSwal, icon: 'error', title: 'Error', text: error.message });
        }
      }
    });
  };

  const handleEditAvatar = () => {
    Swal.fire({
      ...darkSwal,
      title: 'Actualizar foto de perfil',
      html: `
        <div style="text-align: left; margin-bottom: 15px;">
          <span style="font-size: 14px; color: #a0a0a0;">Selecciona una imagen de tus archivos, galería o cámara:</span>
        </div>
        <input type="file" id="avatar-upload" accept="image/*" class="custom-file-upload">
      `,
      showCancelButton: true,
      confirmButtonText: 'Subir Foto',
      cancelButtonText: 'Cancelar',
      background: '#141414',
      color: '#fff',
      confirmButtonColor: '#f5b400',
      preConfirm: () => {
        const file = document.getElementById('avatar-upload').files[0];
        if (!file) {
          Swal.showValidationMessage(
            'Por favor, selecciona una imagen primero (Archivos o Cámara).'
          );
          return false;
        }
        return file;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const newImage = e.target.result;
          setUserInfo((prev) => ({ ...prev, image: newImage }));

          const sessionUser = JSON.parse(localStorage.getItem('user'));
          localStorage.setItem('user', JSON.stringify({ ...sessionUser, image: newImage }));

          try {
            await api.patch(`/users/${userInfo.id}`, { image: newImage });
          } catch (err) {
            console.error('Error guardando imagen en el backend', err);
          }

          Swal.fire({
            ...darkSwal,
            icon: 'success',
            title: '¡Foto Actualizada!',
            timer: 1500,
            showConfirmButton: false,
          });
        };
        reader.readAsDataURL(result.value);
      }
    });
  };

  const toggleFavorite = async (vehicleId) => {
    const vidStr = String(vehicleId);
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return;

    const user = JSON.parse(savedUser);
    let updatedFavorites = Array.isArray(user.favorites) ? user.favorites.map(String) : [];

    if (updatedFavorites.includes(vidStr)) {
      updatedFavorites = updatedFavorites.filter((id) => id !== vidStr);
    } else {
      updatedFavorites.push(vidStr);
    }

    try {
      await api.patch(`/users/${user.id}`, { favorites: updatedFavorites });

      user.favorites = updatedFavorites;
      localStorage.setItem('user', JSON.stringify(user));

      if (updatedFavorites.includes(vidStr)) {
        toast.success('Añadido a favoritos', { icon: '⭐' });
      } else {
        toast('Eliminado de favoritos');
      }

      setVehicles(
        vehicles.map((v) => (String(v.id) === vidStr ? { ...v, isFavorite: !v.isFavorite } : v))
      );

      if (!updatedFavorites.includes(vidStr)) {
        setVehicles((prev) => prev.filter((v) => String(v.id) !== vidStr));
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        ...darkSwal,
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el favorito.',
      });
    }
  };

  const handleAddVehicle = () => {
    const availableVehicles = (allVehicles || []).filter(
      (dbCar) => !vehicles.some((myCar) => String(myCar.id) === String(dbCar.id))
    );

    if (availableVehicles.length === 0) {
      Swal.fire({
        ...darkSwal,
        icon: 'info',
        title: 'Colección Completa',
        text: 'Ya tienes todos los vehículos disponibles en el catálogo.',
      });
      return;
    }

    const inputOptions = {};
    availableVehicles.forEach((car) => {
      inputOptions[car.id] =
        `${car.name} (${car.year}) - ₡${Number(car.price || car.precio).toLocaleString('es-CR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    });

    Swal.fire({
      ...darkSwal,
      title: 'Agregar Vehículo',
      text: 'Selecciona un vehículo del catálogo:',
      input: 'select',
      inputOptions: inputOptions,
      inputPlaceholder: 'Selecciona un vehículo...',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Seleccionar',
    }).then((result) => {
      if (result.isConfirmed) {
        const selectedId = result.value;
        const selectedCarDb = availableVehicles.find((c) => String(c.id) === String(selectedId));

        if (selectedCarDb) {
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            const user = JSON.parse(savedUser);
            const updatedFavorites = [...(user.favorites || []), String(selectedCarDb.id)];

            api
              .patch(`/users/${user.id}`, { favorites: updatedFavorites })
              .then(() => {
                user.favorites = updatedFavorites;
                localStorage.setItem('user', JSON.stringify(user));

                const newV = {
                  id: selectedCarDb.id,
                  name: selectedCarDb.name,
                  image: selectedCarDb.image,
                  year: selectedCarDb.year.toString(),
                  specs: `${selectedCarDb.motor} • ${selectedCarDb.mileage}`,
                  isFavorite: true,
                  importStatus: 1,
                };
                setVehicles([...vehicles, newV]);
                toast.success('Añadido a colección', { icon: '⭐' });

                Swal.fire({
                  ...darkSwal,
                  icon: 'success',
                  title: '¡Añadido!',
                  text: `El ${selectedCarDb.name} ha sido agregado a tu colección.`,
                });
              })
              .catch((err) => {
                console.error(err);
                Swal.fire({
                  ...darkSwal,
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudo guardar en la base de datos.',
                });
              });
          }
        }
      }
    });
  };

  return {
    activeTab,
    setActiveTab,
    vehicles,
    allVehicles,
    selectedVehicle,
    setSelectedVehicle,
    userRequests,
    userInfo,
    handleLogout,
    handleUpdateTracking,
    handleEditProfile,
    handleChangePassword,
    handleEditAvatar,
    toggleFavorite,
    handleAddVehicle,
  };
};
