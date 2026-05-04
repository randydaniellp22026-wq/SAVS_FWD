import { useState } from 'react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:5000';

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

    // 1. Campos vacíos
    if (!nombre.trim() || !correo.trim() || !telefono.trim() || !password.trim()) {
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Campos incompletos', text: 'Todos los campos son obligatorios.' });
      return false;
    }

    // 2. Sanitización de Nombre (Solo letras y espacios, longitud max 50)
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;
    if (!regexNombre.test(nombre.trim())) {
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Nombre no válido', text: 'El nombre debe tener entre 3 y 50 caracteres y no contener números ni símbolos.' });
      return false;
    }

    // 3. Correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo.trim())) {
      Swal.fire({ ...darkSwal, icon: 'error', title: 'Correo inválido', text: 'Ingresa un formato de correo electrónico válido.' });
      return false;
    }

    // 4. Teléfono
    const regexTelefono = /^[0-9+\s\-()]{8,20}$/;
    if (!regexTelefono.test(telefono.trim())) {
      Swal.fire({ 
        ...darkSwal, 
        icon: 'error', 
        title: 'Teléfono inválido', 
        text: 'Formato de teléfono no reconocido.'
      });
      return false;
    }

    // 5. Fuerza de contraseña (mínimo 8 caracteres, al menos una letra y un número)
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!regexPassword.test(password)) {
      Swal.fire({ 
        ...darkSwal, 
        icon: 'error', 
        title: 'Contraseña insuficiente', 
        text: 'La contraseña debe tener al menos 8 caracteres, incluir letras y números.' 
      });
      return false;
    }

    // 6. Confirmación de contraseña
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
      const resCheck = await fetch(`${API_URL}/users`);
      const allUsers = await resCheck.json();
      
      const newEmail = formData.correo.trim().toLowerCase();
      const emailExists = allUsers.some(u => (u.email || '').toLowerCase() === newEmail);

      if (emailExists) {
        Swal.fire({ 
          ...darkSwal, 
          icon: 'warning', 
          title: 'Correo ya registrado', 
          text: 'Este correo ya tiene una cuenta asociada. Inicia sesión para continuar.' 
        });
        return;
      }

      // POST new user to JSON Server
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: newEmail,
          correo: newEmail,
          telefono: formData.telefono.trim(),
          password: formData.password,
          rol: 'Cliente',
          ubicacion: 'Costa Rica',
          createdAt: new Date().toISOString(),
          favorites: []
        })
      });

      if (!res.ok) throw new Error('Error al guardar el usuario en la base de datos.');

      Swal.fire({
        ...darkSwal,
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada con éxito. Ya puedes iniciar sesión.',
        confirmButtonText: 'Ir a Iniciar Sesión'
      }).then(() => {
        window.location.href = '/login';
      });

      setFormData({ nombre: '', correo: '', telefono: '', password: '' });

    } catch (err) {
      console.error("Error en registro:", err);
      Swal.fire({ 
        ...darkSwal, 
        icon: 'error', 
        title: 'Error de servidor', 
        text: 'No se pudo conectar con el servidor. Asegúrate de que json-server esté ejecutándose.' 
      });
    }
  };

  return { formData, handleChange, handleSubmit };
};
