import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000';

const darkSwal = {
  background: '#0a0a0a',
  color: '#fff',
  confirmButtonColor: '#eab308'
};

export const useLoginLogic = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones de frontend
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Por favor, completa todos los campos.');
      setLoading(false);
      return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(formData.email)) {
      setError('Ingresa un formato de correo válido.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users`);

      if (!response.ok) throw new Error('Error al conectar con el servidor.');

      const allUsers = await response.json();
      
      // Búsqueda manual insensible a mayúsculas en el email
      const inputEmail = formData.email.trim().toLowerCase();
      const user = allUsers.find(u => 
        (u.email || '').toLowerCase() === inputEmail && 
        u.password === formData.password.trim()
      );

      if (user) {
        localStorage.setItem('user', JSON.stringify({ 
          id: user.id, 
          nombre: user.nombre, 
          email: user.email,
          rol: user.rol || 'Usuario',
          telefono: user.telefono || '',
          ubicacion: user.ubicacion || 'Costa Rica',
          favorites: user.favorites || [],
          image: user.image || ''
        }));
        
        toast.success(`¡Bienvenido de nuevo, ${user.nombre.split(' ')[0]}!`);
        
        Swal.fire({
          ...darkSwal,
          icon: 'success',
          title: '¡Bienvenido!',
          text: `Sesión iniciada como ${user.nombre}`
        }).then(() => {
          navigate('/');
        });
      } else {
        throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = () => {
    setFormData({
      email: 'admin@thedestinyvault.com',
      password: 'admin'
    });
  };

  return { formData, loading, error, handleChange, handleSubmit, fillTestCredentials };
};
