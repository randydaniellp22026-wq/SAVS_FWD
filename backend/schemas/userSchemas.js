const { z, optionalString } = require('./common');

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Correo electrónico inválido')
  .max(160, 'correo/email no puede exceder 160 caracteres');

const baseUserSchema = {
  nombre: z.string().trim().min(2, 'nombre es requerido').max(120, 'nombre no puede exceder 120 caracteres'),
  email: emailSchema.optional(),
  correo: emailSchema.optional(),
  password: z.string().min(8, 'password mínimo 8 caracteres').max(128, 'password máximo 128 caracteres').optional(),
  rolId: z.coerce.number().int().positive().optional(),
  telefono: optionalString(30, 'telefono'),
  ubicacion: optionalString(120, 'ubicacion'),
  direccion_precisa: optionalString(255, 'direccion_precisa'),
};

const createUserSchema = z
  .object(baseUserSchema)
  .refine((data) => data.email || data.correo, { message: 'email o correo es requerido', path: ['email'] });

const updateUserSchema = z
  .object({
    ...baseUserSchema,
    nombre: baseUserSchema.nombre.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Debes enviar al menos un campo' });

module.exports = {
  createUserSchema,
  updateUserSchema,
};
