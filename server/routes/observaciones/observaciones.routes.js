import express from 'express';
import { validateParamsIds } from '../../middlewares/validateParamsIds.js';

//Importacion de rutas al modelo
import { createObservacion } from '../../controllers/Observaciones/createObservacion.js';
import { getObservacionesByFichaAprendiz } from '../../controllers/Observaciones/getObservacionesByFichaAprendiz.js';
import { updateObservacionById } from '../../controllers/Observaciones/updateObservacionById.js';
import { updateObservacionState } from '../../controllers/observaciones/updateObservacionState.js';
import { deleteObservacion } from '../../controllers/Observaciones/deleteObservacion.js';

/* Rutas observaciones */

const routerObservaciones = express.Router();

//Crear un observación
routerObservaciones.post('/', createObservacion);

//Visualizar todas las observaciones de un aprendiz
routerObservaciones.get(
  '/ficha-aprendiz/:idFichaAprendiz/',
  validateParamsIds,
  getObservacionesByFichaAprendiz
);

//Modificar una observación por [ID]
routerObservaciones.put(
  '/:idObservacion',
  validateParamsIds,
  updateObservacionById
);

//Modificar el estado de la observación por [ID]
routerObservaciones.patch(
  '/:idObservacion/estado',
  validateParamsIds,
  updateObservacionState
);

//Borrar observación por [ID]
routerObservaciones.delete(
  '/:idObservacion',
  validateParamsIds,
  deleteObservacion
);

export default routerObservaciones;
