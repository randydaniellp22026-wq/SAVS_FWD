/**
 * Controlador de Vehículos (Autos)
 * Delegado al servicio VehicleService para lógica de negocio de datos.
 * Utiliza asyncHandler para la gestión unificada de errores asíncronos.
 */
const VehicleService = require('../services/vehicleService');
const asyncHandler = require('../utils/asyncHandler');
const path = require('path');
const fs = require('fs');

/**
 * Obtiene todos los vehículos con paginación, filtros y búsqueda inteligente.
 */
exports.getAll = asyncHandler(async (req, res) => {
  const result = await VehicleService.listar(req.query);
  res.json(result);
});

/**
 * Obtiene un vehículo por su ID.
 */
exports.getById = asyncHandler(async (req, res) => {
  const data = await VehicleService.obtenerPorId(req.params.id);
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'No encontrado' });
  }
});

/**
 * Crea un nuevo vehículo.
 */
exports.create = asyncHandler(async (req, res) => {
  // Validación de campos requeridos
  const requiredFields = ['name', 'price', 'year'];
  const missing = requiredFields.filter((field) => !req.body[field] && req.body[field] !== 0);
  if (missing.length > 0) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    return res.status(400).json({
      error: `Campos requeridos faltantes: ${missing.join(', ')}`,
    });
  }

  const vehicleData = { ...req.body };
  if (req.file) {
    vehicleData.image = `/uploads/${req.file.filename}`;
  }

  const data = await VehicleService.crear(vehicleData);
  res.status(201).json(data);
});

/**
 * Actualiza un vehículo existente.
 */
exports.update = asyncHandler(async (req, res) => {
  const vehicleData = { ...req.body };
  if (req.file) {
    vehicleData.image = `/uploads/${req.file.filename}`;

    // Eliminar imagen anterior
    const existing = await VehicleService.obtenerPorId(req.params.id);
    if (existing && existing.image && existing.image.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', existing.image);
      fs.unlink(oldPath, () => {});
    }
  }

  const data = await VehicleService.actualizar(req.params.id, vehicleData);
  if (data) {
    res.json(data);
  } else {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(404).json({ error: 'No encontrado' });
  }
});

/**
 * Elimina un vehículo y su imagen del disco.
 */
exports.remove = asyncHandler(async (req, res) => {
  const existing = await VehicleService.obtenerPorId(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'No encontrado' });
  }

  if (existing.image && existing.image.startsWith('/uploads/')) {
    const imagePath = path.join(__dirname, '..', existing.image);
    fs.unlink(imagePath, () => {});
  }

  await VehicleService.eliminar(req.params.id);
  res.json({ message: 'Eliminado correctamente' });
});
