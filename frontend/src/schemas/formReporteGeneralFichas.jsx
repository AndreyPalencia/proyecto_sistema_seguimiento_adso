// schemas/reporteSchema.ts
import { z } from 'zod';

const formReporteGeneralFichas = z.object({
  ficha: z.coerce.number().min(1, 'Selecciona una ficha'),
  jefe: z.boolean().optional(),
  aprendiz: z.object({
    nombre: z.boolean().optional(),
    numeroDocumento: z.boolean().optional(),
    tipoDocumento: z.boolean().optional(),
    telefono: z.boolean().optional(),
    correoElectronico: z.boolean().optional(),
  }),
  empresa: z.object({
    nit: z.boolean().optional(),
    razonSocial: z.boolean().optional(),
    telefono: z.boolean().optional(),
    correoElectronico: z.boolean().optional(),
    direccion: z.boolean().optional(),
    jefeInmediato: z.boolean().optional(),
  }),
  reportes: z.object({
    numeroVisitas: z.coerce.number().min(1, 'Selecciona el números'),
    numeroBitacoras: z.coerce.number().min(1, 'Selecciona una bitácora'),
    bitacorasAprobadas: z.boolean().optional(),
    visitasRealizadas: z.boolean().optional(),
  }),
});

export default formReporteGeneralFichas;
