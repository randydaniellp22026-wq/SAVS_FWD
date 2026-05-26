const { z } = require('zod');

const optionalString = (max, field) =>
  z
    .string()
    .trim()
    .max(max, `${field} no puede exceder ${max} caracteres`)
    .optional();

const uuidOrTextId = z
  .string()
  .trim()
  .min(1, 'id es requerido')
  .max(64, 'id no puede exceder 64 caracteres');

module.exports = {
  z,
  optionalString,
  uuidOrTextId,
};
