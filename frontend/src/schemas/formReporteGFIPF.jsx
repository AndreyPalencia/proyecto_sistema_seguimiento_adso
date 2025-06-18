import { z } from 'zod';

const infoGeneral = z.object({
  regional: z.string().trim().min(5, 'Este campo es Obligatorio'),
  centroFormacion: z.string().trim().min(5, 'Este campo es Obligatorio'),
});

// Definimos actividadesDesarrolladas como un array de objetos
const actividadesDesarrolladas = z
  .object({
    actividades: z.string().min(1, 'Este campo es Obligatorio'),
    evidencias: z.string().min(1, 'Este campo es Obligatorio'),
    fecha: z.string().min(1, 'Este campo es Obligatorio'),
    lugar: z.string().min(1, 'Este campo es Obligatorio'),
    observacionesPlaneacion: z.string().optional(),
  })
  .refine((data) => !isNaN(Date.parse(data.fecha)), {
    message: 'Debe ser una fecha válida',
  });

const infoSeguimientoInforme = z
  .object({
    tipoInforme: z.boolean(),
    inicioPeriodoEvaluado: z.coerce.date({
      invalid_type_error: 'Fecha inválida',
    }),
    finalizacionPeriodoEvaluado: z.coerce.date({
      invalid_type_error: 'Fecha inválida',
    }),
  })
  .refine(
    (data) => {
      // Compara que ambas fechas sean válidas
      const inicioFecha = new Date(data.inicioPeriodoEvaluado);
      const finFecha = new Date(data.finalizacionPeriodoEvaluado);

      // Si alguna de las fechas no es válida, retornamos falso
      return !isNaN(inicioFecha) && !isNaN(finFecha);
    },
    {
      message: 'Las fechas no son válidas',
      path: ['inicioPeriodoEvaluado', 'finalizacionPeriodoEvaluado'],
    }
  );

const actitudinalesComportamentales = z.object({
  relacionesInterpersonales: z.boolean(),
  relacionesObservacion: z.string().optional(),
  trabajoEnEquipo: z.boolean(),
  trabajoObservacion: z.string().optional(),
  solucionProblemas: z.boolean(),
  solucionProblemasObservacion: z.string().optional(),
  cumplimiento: z.boolean(),
  cumplimientoObservacion: z.string().optional(),
  organizacion: z.boolean(),
  organizacionObservacion: z.string().optional(),
});

const tecnicos = z.object({
  transferenciaConocimiento: z.boolean(),
  transferenciaObservacion: z.string().optional(),
  mejoraContinua: z.boolean(),
  mejoraContinuaObservacion: z.string().optional(),
  fortalecimientOcupacional: z.boolean(),
  fortalecimientoObservacion: z.string().optional(),
  calidad: z.boolean(),
  calidadObservacion: z.string().optional(),
  ambiental: z.boolean(),
  ambientalObservacion: z.string().optional(),
  administracion: z.boolean(),
  administracionObservacion: z.string().optional(),
  seguridad: z.boolean(),
  seguridadObservacion: z.string().optional(),
  documentacion: z.boolean(),
  documentacionObservacion: z.string().optional(),
});

const evaluacionFinal = z.object({
  juicioEvaluacion: z.boolean(),
  reconocimientosEspeciales: z.boolean(),
  reconocimientosEspecialesLista: z.string().optional(),
  cuidadElaboracion: z.string().min(1, 'Este campo es Obligatorio'),
  fechaGeneracionInforme: z
    .string()
    .min(1, 'Este campo es Obligatorio')
    .refine((value) => !isNaN(Date.parse(value)), {
      message: 'Debe ser una fecha válida',
    }),
});

// El campo actividadesDesarrolladas ahora es un array de objetos
const formReporteGFIPF = z.object({
  infoGeneral: infoGeneral,
  infoPlaneacion: z.object({
    actividadesDesarrolladas: z.array(actividadesDesarrolladas), // Array de objetos
  }),
  infoSeguimiento: z.object({
    infoSeguimientoInforme: infoSeguimientoInforme,
    factoresEvaluacion: z.object({
      actitudinalesComportamentales: actitudinalesComportamentales,
      tecnicos: tecnicos,
    }),
    observacionesEnteConformador: z
      .string()
      .optional()
      .refine((value) => value === undefined || value.length > 5, {
        message: 'Debe contener por lo menos 5 caracteres',
      }),

    observacionesAprendiz: z
      .string()
      .optional()
      .refine((value) => value === undefined || value.length > 5, {
        message: 'Debe contener por lo menos 5 caracteres',
      }),
  }),
  evaluacionFinal: evaluacionFinal,
});

export { formReporteGFIPF, actividadesDesarrolladas };
