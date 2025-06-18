import { z } from 'zod';

const tipoDocumentoFormatos = [
  'CartaLaboral',
  'CertificadoTyT',
  'CertificadoRegistroAPE',
  'DocumentoIdentidad',
  'CarnetSENADestruido',
];

const formCrearDocumento = (tiposValidos) => {
  // Si tiposValidos está vacío o no es un array, usamos los formatos por defecto
  const formatosValidos =
    Array.isArray(tiposValidos) && tiposValidos.length > 0
      ? tiposValidos
      : tipoDocumentoFormatos;

  return z.object({
    idFichaAprendiz: z.coerce
      .number()
      .min(1, 'Debe tener un aprendiz seleccionado')
      .optional(),
    tipoDocumento: z.string().refine((val) => formatosValidos.includes(val), {
      message: 'Tipo de documento no permitido',
    }),
    observacion: z.preprocess(
      (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
      z
        .string()
        .min(6, 'La observación debe tener mínimo 6 caracteres')
        .max(250, 'La observación debe tener máximo 250 caracteres')
        .optional()
    ),
    estadoDocumento: z.boolean().default(false),
    fechaUltimaActualizacion: z.coerce.date({
      invalid_type_error: 'Fecha inválida',
    }),
    archivo: z
      .instanceof(File, 'No se ha registrado ningún archivo subido')
      .refine((file) => file.size > 0, {
        message: 'Debe seleccionar un archivo válido.',
        path: ['archivo'],
      }),
  });
};

const formEditarDocumento = z.object({
  idDocumento: z.coerce.number().min(1, 'Debe tener un idDocumento'),
  idFichaAprendiz: z.coerce
    .number()
    .min(1, 'Debe tener un aprendiz seleccionado'),
  tipoDocumento: z.enum(tipoDocumentoFormatos, {
    errorMap: () => ({ message: 'Tipo de documento no válido' }),
  }),
  observacion: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z
      .string()
      .min(6, 'La observación debe tener mínimo 6 caracteres')
      .max(250, 'La observación debe tener máximo 250 caracteres')
      .optional()
      .nullable()
  ),
  estadoDocumento: z.boolean().default(false),
  fechaUltimaActualizacion: z.coerce.date({
    invalid_type_error: 'Fecha inválida',
  }),
  archivo: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: 'Debe seleccionar un archivo válido.',
    })
    .optional()
    .nullable(),
});

export { formCrearDocumento, formEditarDocumento };
