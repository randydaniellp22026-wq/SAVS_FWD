/**
 * Controlador de Usuarios (Users)
 * Maneja las operaciones CRUD delegando la lógica de negocio a UserService.
 * Utiliza asyncHandler para la captura limpia de excepciones.
 */
const UserService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Obtiene todos los usuarios registrados en el sistema.
 */
exports.getAll = asyncHandler(async (req, res) => {
  const data = await UserService.obtenerTodos();
  res.json(data);
});

/**
 * Obtiene un usuario específico por su ID.
 */
exports.getById = asyncHandler(async (req, res) => {
  const data = await UserService.obtenerPorId(req.params.id);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'No encontrado' });
  }
});

/**
 * Crea un nuevo usuario.
 */
exports.create = asyncHandler(async (req, res) => {
  const data = await UserService.crear(req.body);
  res.status(201).json(data);
});

/**
 * Actualiza la información de un usuario existente.
 */
exports.update = asyncHandler(async (req, res) => {
  const data = await UserService.actualizar(req.params.id, req.body);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'No encontrado' });
  }
});

/**
 * Elimina un usuario de forma definitiva.
 */
exports.remove = asyncHandler(async (req, res) => {
  const deleted = await UserService.eliminar(req.params.id);
  if (deleted) {
    res.json({ message: 'Eliminado correctamente' });
  } else {
    res.status(404).json({ error: 'No encontrado' });
  }
});
