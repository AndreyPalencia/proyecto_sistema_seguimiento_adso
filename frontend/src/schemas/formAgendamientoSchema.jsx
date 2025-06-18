import { z } from 'zod';

const estados = [
  'Programada',
  'Pendiente',
  'Realizada',
  'Cancelada',
  'Reprogramada',
  'Solicitud',
];

const tiposVisita = ['Presencial', 'Virtual', 'Telefonica'];

const formAgendamientoSchema = z.object({
  idAgendamiento: z.coerce.number().min(1, 'Debe tener un idAgendamiento'),
  idFicha: z.coerce.number().min(1, 'Debe seleccionar una ficha'),
  idFichaAprendiz: z.coerce.number().min(1, 'Debe seleccionar un aprendiz'),
  idInstructor: z.coerce.number().min(1, 'Este campo es obligatorio'),
  enlaceReunion: z
    .string()
    .min(
      15,
      'El enlace de la reunión debe contener por lo menos 15 caractares.'
    )
    .max(
      254,
      'El enlace de reunión sobrepasa el maximo de caractares permitidos de 245'
    )
    .or(z.literal('')) // permite cadena vacía explícitamente

    .optional(),
  herramientaReunion: z.string().optional(),
  fechaInicio: z.coerce.date({ invalid_type_error: 'Fecha inválida' }),
  fechaFin: z.coerce.date({ invalid_type_error: 'Fecha inválida' }),
  estadoVisita: z.enum(estados),
  tipoVisita: z.enum(tiposVisita),
  numeroVisita: z.coerce.number().min(1, 'Debe ser al menos 1'),
});

const aplicarValidacionesFecha = (schema) =>
  schema
    // Validación: fechas válidas y fechaInicio <= fechaFin
    .refine(
      (data) => {
        const inicio = new Date(data.fechaInicio);
        const fin = new Date(data.fechaFin);

        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return false;

        return inicio <= fin;
      },
      {
        message:
          'La Fecha de inicio tiene que ser antes que la Fecha de fin y ambas deben ser válidas',
        path: ['fechaInicio'],
      }
    )

    // Validación: fechas en el mismo día
    .refine(
      (data) => {
        const inicio = new Date(data.fechaInicio);
        const fin = new Date(data.fechaFin);

        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return false;

        return (
          inicio.getFullYear() === fin.getFullYear() &&
          inicio.getMonth() === fin.getMonth() &&
          inicio.getDate() === fin.getDate()
        );
      },
      {
        message: 'Las fechas deben estar en el mismo día',
        path: ['fechaFin'],
      }
    )

    .refine(
      (data) => {
        if (data.tipoVisita === 'Virtual') {
          return (
            data.enlaceReunion &&
            data.enlaceReunion.trim().length > 0 &&
            (data.enlaceReunion.startsWith('http://') ||
              data.enlaceReunion.startsWith('https://'))
          );
        }
        return true;
      },
      {
        message:
          'Debe ingresar un enlace de reunión válido que comience con http:// o https://',
        path: ['enlaceReunion'],
      }
    )
    .refine(
      (data) => {
        if (data.tipoVisita === 'Virtual') {
          return (
            data.herramientaReunion && data.herramientaReunion.trim().length > 0
          );
        }
        return true;
      },
      {
        message: 'Debe ingresar la herramienta de reunión',
        path: ['herramientaReunion'],
      }
    );

export const crearAgendamientoSchema = aplicarValidacionesFecha(
  formAgendamientoSchema.omit({
    idAgendamiento: true,
  })
);

export const editarAgendamientoSchema = aplicarValidacionesFecha(
  formAgendamientoSchema
);
