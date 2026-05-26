const { z, optionalString } = require('./common');

const numericStringOrNumber = z.union([z.number(), z.string().trim().min(1)]).optional();

// Compatibilidad (transición):
// - Canonical: `year`, `price`
// - Alias (legacy): `anio`, `precio`
// Durante el release de transición aceptamos ambos y normalizamos a canónicos.
const vehicleCreateShape = z.object({
  id: z.string().trim().max(64).optional(),
  name: z.string().trim().max(120).optional(),
  marca: z.string().trim().min(1, 'marca es requerida').max(80, 'marca no puede exceder 80 caracteres'),
  modelo: z.string().trim().min(1, 'modelo es requerido').max(80, 'modelo no puede exceder 80 caracteres'),

  year: z.coerce.number().int().min(1900).max(2100).optional(),
  anio: z.coerce.number().int().min(1900).max(2100).optional(),
  'año': z.coerce.number().int().min(1900).max(2100).optional(),
  price: z.coerce.number().min(0).optional(),
  precio: z.coerce.number().min(0).optional(),

  type: optionalString(50, 'type'),
  fuel: optionalString(50, 'fuel'),
  transmission: optionalString(50, 'transmission'),
  color: optionalString(50, 'color'),
  doors: z.coerce.number().int().min(1).max(10).optional(),
  passengers: z.coerce.number().int().min(1).max(20).optional(),
  mileage: numericStringOrNumber,
  tag: optionalString(50, 'tag'),
  summary: z.string().trim().max(2000, 'summary máximo 2000 caracteres').optional(),
});

const createVehicleSchema = vehicleCreateShape
  .superRefine((data, ctx) => {
    const resolvedYear = data.year ?? data.anio ?? data['año'];
    const resolvedPrice = data.price ?? data.precio;

    if (resolvedYear == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'year o anio es requerido',
        path: ['year'],
      });
    }
    if (resolvedPrice == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'price o precio es requerido',
        path: ['price'],
      });
    }
  })
  .transform((data) => {
    const year = data.year ?? data.anio ?? data['año'];
    const price = data.price ?? data.precio;
    const name = data.name ?? `${data.marca} ${data.modelo}`.trim();
    return {
      ...data,
      name,
      year,
      price,
    };
  });

const updateVehicleSchema = vehicleCreateShape
  .partial()
  .superRefine((data, ctx) => {
    if (!data) return;

    // Validación: al menos un campo para actualizar
    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debes enviar al menos un campo para actualizar',
      });
      return;
    }

    // Si vienen alias/canónicos de year/price, aseguramos que haya valor resoluble
    const resolvedYear = data.year ?? data.anio ?? data['año'];
    const resolvedPrice = data.price ?? data.precio;

    if ((data.year != null || data.anio != null) && resolvedYear == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'year o anio es requerido',
        path: ['year'],
      });
    }
    if ((data.price != null || data.precio != null) && resolvedPrice == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'price o precio es requerido',
        path: ['price'],
      });
    }
  })
  .transform((data) => {
    const out = { ...data };

    if (out.year == null && out.anio != null) out.year = out.anio;
    if (out.year == null && out['año'] != null) out.year = out['año'];
    if (out.price == null && out.precio != null) out.price = out.precio;

    // Si se actualizan marca+modelo y no se envía name, completamos.
    if (out.name == null && out.marca != null && out.modelo != null) {
      out.name = `${out.marca} ${out.modelo}`.trim();
    }

    return out;
  });

module.exports = {
  createVehicleSchema,
  updateVehicleSchema,
};
