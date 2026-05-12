import { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';

const darkSwal = {
  background: '#0a0a0a',
  color: '#fff',
  confirmButtonColor: '#eab308'
};

export const useRegistroUsuariosLogica = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    const { nombre, correo, telefono, password, confirmPassword } = formData;

    if (!nombre.trim() || !correo.trim() || !telefono.trim() || !password.trim()) {
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Campos incompletos', text: 'Todos los campos son obligatorios.' });
      return false;
    }

    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;
    if (!regexNombre.test(nombre.trim())) {
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Nombre no válido', text: 'El nombre debe tener entre 3 y 50 caracteres y no contener números ni símbolos.' });
      return false;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo.trim())) {
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Correo inválido', text: 'Ingresa un formato de correo electrónico válido.' });
      return false;
    }

    const regexTelefono = /^[0-9+\s\-()]{8,20}$/;
    if (!regexTelefono.test(telefono.trim())) {
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Teléfono inválido', text: 'Formato de teléfono no reconocido.' });
      return false;
    }

    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!regexPassword.test(password)) {
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Contraseña insuficiente', text: 'La contraseña debe tener al menos 8 caracteres, incluir letras y números.' });
      return false;
    }

    if (password !== confirmPassword) {
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Error de coincidencia', text: 'Las contraseñas no coinciden.' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      // Verificar si el correo ya existe
      const resCheck = await api.get('/users');
      const allUsers = resCheck.data;
      
      const newEmail = formData.correo.trim().toLowerCase();
      const emailExists = allUsers.some(u => (u.email || u.correo || '').toLowerCase() === newEmail);

      if (emailExists) {
        Swal.fire({ ...darkSwal, icon: 'warning', title: 'Correo ya registrado', text: 'Este correo ya tiene una cuenta asociada. Inicia sesión para continuar.' });
        return;
      }

      // POST new user to Backend
      const res = await api.post('/users', {
        id: Date.now().toString(), // Generando un ID temporal de string para compatibilidad
        nombre: formData.nombre,
        email: newEmail,
        correo: newEmail,
        telefono: formData.telefono.trim(),
        password: formData.password,
        rolId: 3, // ID de 'Cliente' por defecto
        ubicacion: 'Costa Rica',
        favorites: []
      });

      Swal.fire({
        ...darkSwal,
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada con éxito. Ya puedes iniciar sesión.',
        confirmButtonText: 'Ir a Iniciar Sesión'
      }).then(() => {
        window.location.href = '/login';
      });

      setFormData({ nombre: '', correo: '', telefono: '', password: '', confirmPassword: '' });

    } catch (err) {
      console.error("Error en registro:", err);
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Error de servidor', text: 'No se pudo completar el registro en la base de datos.' });
    }
  };

  return { formData, handleChange, handleSubmit };
};
