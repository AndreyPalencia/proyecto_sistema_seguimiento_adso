import { z } from 'zod';

const formObservacion = z.object({
  idFichaAprendiz: z.coerce.number().min(1, 'Debe ser un id válido').optional(),

  observacion: z.string().min(1, 'Debe ingresar una observación'),

  mostrarObservacion: z.boolean(),

  fechaUltimaActualizacion: z.string(),
});

export default formObservacion;
