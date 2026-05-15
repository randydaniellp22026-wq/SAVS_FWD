import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configuración básica de Axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Para enviar cookies si es necesario
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Servicio de Vehículos
 */
export const vehicleService = {
  // Obtener lista con filtros y paginación
  getAll: async (params = {}) => {
    const response = await api.get('/vehicles', { params });
    return response.data;
  },

  // Obtener un vehículo por ID
  getById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  // Crear nuevo (Soporta FormData para imágenes)
  create: async (data) => {
    const response = await api.post('/vehicles', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Actualizar
  update: async (id, data) => {
    const response = await api.put(`/vehicles/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Eliminar
  delete: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  }
};

/**
 * Servicio de Autenticación
 */
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export default api;
