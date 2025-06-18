import { z } from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore); // 👈 Necesario para evitar el error

const hoyUtc = dayjs.utc().startOf('day');

const formReporteVisitas = z
  .object({
    fechaInicio: z
      .string({
        required_error: 'La fecha de inicio es obligatoria',
      })
      .refine((val) => dayjs(val, 'YYYY-MM-DD', true).isValid(), {
        message: 'Fecha de inicio inválida',
      })
      .refine(
        (val) => {
          const parsed = dayjs.utc(val, 'YYYY-MM-DD');
          return parsed.isBefore(hoyUtc) || parsed.isSame(hoyUtc);
        },
        {
          message: 'La fecha de inicio no puede ser en el futuro',
        }
      ),

    fechaFin: z
      .string({
        required_error: 'La fecha final es obligatoria',
      })
      .refine((val) => dayjs(val, 'YYYY-MM-DD', true).isValid(), {
        message: 'Fecha final inválida',
      })
      .refine(
        (val) => {
          const parsed = dayjs.utc(val, 'YYYY-MM-DD');
          return parsed.isBefore(hoyUtc) || parsed.isSame(hoyUtc);
        },
        {
          message: 'La fecha final no puede ser en el futuro',
        }
      ),
  })
  .refine(
    (data) => {
      const inicio = dayjs.utc(data.fechaInicio, 'YYYY-MM-DD');
      const fin = dayjs.utc(data.fechaFin, 'YYYY-MM-DD');
      return inicio.isSameOrBefore(inicio); // ✅ La lógica correcta
    },
    {
      message: 'La fecha de inicio debe ser anterior o igual a la fecha final',
      path: ['fechaInicio'],
    }
  );

export const formReporteConFiltroOpcional = z
  .object({
    ignoreDateFilter: z.boolean(),
    fechaInicio: z.string().optional(),
    fechaFin: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { ignoreDateFilter, fechaInicio, fechaFin } = data;

    // Si ignoreDateFilter es false, las fechas deben estar y ser válidas
    if (!ignoreDateFilter) {
      if (!fechaInicio) {
        ctx.addIssue({
          path: ['fechaInicio'],
          message: 'La fecha de inicio es obligatoria',
          code: z.ZodIssueCode.custom,
        });
      } else if (!dayjs(fechaInicio, 'YYYY-MM-DD', true).isValid()) {
        ctx.addIssue({
          path: ['fechaInicio'],
          message: 'Fecha de inicio inválida',
          code: z.ZodIssueCode.custom,
        });
      } else if (dayjs.utc(fechaInicio).isAfter(hoyUtc)) {
        ctx.addIssue({
          path: ['fechaInicio'],
          message: 'La fecha de inicio no puede ser en el futuro',
          code: z.ZodIssueCode.custom,
        });
      }

      if (!fechaFin) {
        ctx.addIssue({
          path: ['fechaFin'],
          message: 'La fecha final es obligatoria',
          code: z.ZodIssueCode.custom,
        });
      } else if (!dayjs(fechaFin, 'YYYY-MM-DD', true).isValid()) {
        ctx.addIssue({
          path: ['fechaFin'],
          message: 'Fecha final inválida',
          code: z.ZodIssueCode.custom,
        });
      } else if (dayjs.utc(fechaFin).isAfter(hoyUtc)) {
        ctx.addIssue({
          path: ['fechaFin'],
          message: 'La fecha final no puede ser en el futuro',
          code: z.ZodIssueCode.custom,
        });
      }

      // Comparar fechas solo si ambas son válidas
      if (
        fechaInicio &&
        fechaFin &&
        dayjs(fechaInicio, 'YYYY-MM-DD', true).isValid() &&
        dayjs(fechaFin, 'YYYY-MM-DD', true).isValid()
      ) {
        const inicio = dayjs.utc(fechaInicio, 'YYYY-MM-DD');
        const fin = dayjs.utc(fechaFin, 'YYYY-MM-DD');

        if (inicio.isAfter(fin)) {
          ctx.addIssue({
            path: ['fechaFin'],
            message:
              'La fecha final debe ser posterior o igual a la fecha de inicio',
            code: z.ZodIssueCode.custom,
          });
        }
      }
    }

    // Si ignoreDateFilter es true:
    // fechas son opcionales, pero si vienen, deben ser válidas (no obligatorias)
    if (ignoreDateFilter) {
      if (fechaInicio) {
        if (!dayjs(fechaInicio, 'YYYY-MM-DD', true).isValid()) {
          ctx.addIssue({
            path: ['fechaInicio'],
            message: 'Fecha de inicio inválida',
            code: z.ZodIssueCode.custom,
          });
        }
      }

      if (fechaFin) {
        if (!dayjs(fechaFin, 'YYYY-MM-DD', true).isValid()) {
          ctx.addIssue({
            path: ['fechaFin'],
            message: 'Fecha final inválida',
            code: z.ZodIssueCode.custom,
          });
        }
      }

      if (
        fechaInicio &&
        fechaFin &&
        dayjs(fechaInicio, 'YYYY-MM-DD', true).isValid() &&
        dayjs(fechaFin, 'YYYY-MM-DD', true).isValid()
      ) {
        const inicio = dayjs.utc(fechaInicio, 'YYYY-MM-DD');
        const fin = dayjs.utc(fechaFin, 'YYYY-MM-DD');

        if (inicio.isAfter(fin)) {
          ctx.addIssue({
            path: ['fechaFin'],
            message:
              'La fecha final debe ser posterior o igual a la fecha de inicio',
            code: z.ZodIssueCode.custom,
          });
        }
      }
    }
  });

export const formBusquedaPorFecha = z.object({
  fechaBusqueda: z
    .string({
      required_error: 'La fecha de búsqueda es obligatoria',
    })
    .refine((val) => dayjs(val, 'YYYY-MM-DD', true).isValid(), {
      message: 'Fecha de búsqueda inválida',
    }),
});

export default formReporteVisitas;
