import { z } from 'zod';

const terminoProgramaEnum = [
  'Tecnólogo',
  'Técnico',
  'Auxiliar',
  'Operario',
  'Especialización',
];

export const formCrearFicha = z
  .object({
    numeroFicha: z
      .string()
      .min(7, 'Debe tener al menos 7 dígitos')
      .max(10, 'No debe superar los 10 dígitos'),
    nombrePrograma: z
      .string()
      .min(5, 'Mínimo 5 caracteres')
      .max(50, 'Máximo 50 caracteres'),
    terminoPrograma: z.enum(terminoProgramaEnum),
    estadoFicha: z.boolean(),
    inicioEtapaProductiva: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: 'Fecha no válida' }),
    finEtapaProductiva: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: 'Fecha no válida' }),
    idInstructor: z.coerce.number(),
  })
  .refine(
    (data) =>
      new Date(data.inicioEtapaProductiva) < new Date(data.finEtapaProductiva),
    {
      message: 'La fecha de inicio debe ser anterior a la fecha de fin.',
      path: ['inicioEtapaProductiva'],
    }
  );
