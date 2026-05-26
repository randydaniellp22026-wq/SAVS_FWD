const { z, optionalString } = require('./common');

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Correo electrónico inválido')
  .max(160, 'email no puede exceder 160 caracteres');

const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .max(128, 'La contraseña no puede exceder 128 caracteres')
  .regex(/^(?=.*[A-Z])(?=.*\d).+$/, 'La contraseña debe incluir una mayúscula y un número');

const registerSchema = z.object({
  id: z.string().trim().max(64, 'id no puede exceder 64 caracteres').optional(),
  nombre: z.string().trim().min(2, 'nombre es requerido').max(120, 'nombre no puede exceder 120 caracteres'),
  email: emailSchema.optional(),
  correo: emailSchema.optional(),
  password: passwordSchema,
  rolId: z.coerce.number().int().positive().optional(),
  telefono: optionalString(30, 'telefono'),
  ubicacion: optionalString(120, 'ubicacion'),
  direccion_precisa: optionalString(255, 'direccion_precisa'),
})
  .refine((data) => data.email || data.correo, { message: 'email o correo es requerido', path: ['email'] });

const loginSchema = z
  .object({
    email: emailSchema.optional(),
    correo: emailSchema.optional(),
    password: z.string().min(1, 'password es requerido').max(128, 'password no puede exceder 128 caracteres'),
  })
  .refine((data) => data.email || data.correo, { message: 'email o correo es requerido', path: ['email'] });

const checkEmailSchema = z.object({
  email: emailSchema,
});

const resetPasswordSchema = z.object({
  userId: z.string().trim().min(1, 'userId es requerido').max(64, 'userId no puede exceder 64 caracteres'),
  newPassword: passwordSchema,
});

module.exports = {
  registerSchema,
  loginSchema,
  checkEmailSchema,
  resetPasswordSchema,
};
