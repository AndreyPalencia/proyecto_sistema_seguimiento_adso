import { z } from 'zod';

const formCrearBitacora = z.object({
  idFichaAprendiz: z.coerce
    .number()
    .min(1, 'Debe tener un aprendiz seleccionado')
    .optional(),
  numeroBitacora: z.coerce
    .number()
    .min(1, 'Debe ser al menos el número de bitácora 1'),
  observacion: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z
      .string()
      .min(6, 'La observación debe tener mínimo 6 caracteres')
      .max(250, 'La observación debe tener máximo 250 caracteres')
      .optional()
  ),
  estadoBitacora: z.boolean(),
  fechaUltimaActualizacion: z.coerce.date({
    invalid_type_error: 'Fecha inválida',
  }),
  archivo: z
    .instanceof(File, 'No se registrado ningun archivo subido')
    .refine((file) => file.size > 0, {
      message: 'Debe seleccionar un archivo válido.',
      path: ['archivo'],
    }),
});

const formEditarBitacora = z.object({
  idBitacora: z.coerce.number().min(1, 'Debe tener un idBitacora '),
  idFichaAprendiz: z.coerce
    .number()
    .min(1, 'Debe tener un aprendiz selecioando'),
  numeroBitacora: z.coerce
    .number()
    .min(1, 'Debe ser al menos el numero de bitacora 1'),
  observacion: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z
      .string()
      .min(6, 'La observación debe tener mínimo 6 caracteres')
      .max(250, 'La observación debe tener máximo 250 caracteres')
      .optional()
  ),
  estadoBitacora: z.boolean(),
  fechaUltimaActualizacion: z.coerce.date({
    invalid_type_error: 'Fecha inválida',
  }),
  archivo: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: 'Debe seleccionar un archivo válido.',
    })
    .optional(),
});

export { formCrearBitacora, formEditarBitacora };
