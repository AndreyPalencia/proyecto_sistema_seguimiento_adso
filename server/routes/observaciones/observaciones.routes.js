import express from 'express';
import { validateParamsIds } from '../../middlewares/validateParamsIds.js';
import verifyToken from '../../middlewares/verifyToken.js';

//Importacion de rutas al modelo
import { createObservacion } from '../../controllers/observaciones/createObservacion.js';
import { getObservacionesByFichaAprendiz } from '../../controllers/observaciones/getObservacionesByFichaAprendiz.js';
import { updateObservacionById } from '../../controllers/observaciones/updateObservacionById.js';
import { updateObservacionState } from '../../controllers/observaciones/updateObservacionState.js';
import { deleteObservacion } from '../../controllers/observaciones/deleteObservacion.js';

/* Rutas observaciones */

const routerObservaciones = express.Router();

//Crear un observación
routerObservaciones.post(
  '/',
  verifyToken(['admin', 'instructor']),
  createObservacion
);

//Visualizar todas las observaciones de un aprendiz
routerObservaciones.get(
  '/ficha-aprendiz/:idFichaAprendiz/',
  validateParamsIds,
  verifyToken(['*']),
  getObservacionesByFichaAprendiz
);

//Modificar una observación por [ID]
routerObservaciones.put(
  '/:idObservacion',
  verifyToken(['*']),
  validateParamsIds,
  updateObservacionById
);

//Modificar el estado de la observación por [ID]
routerObservaciones.patch(
  '/:idObservacion/estado',
  validateParamsIds,
  verifyToken(['admin', 'instructor']),
  updateObservacionState
);

//Borrar observación por [ID]
routerObservaciones.delete(
  '/:idObservacion',
  validateParamsIds,
  verifyToken(['admin', 'instructor']),
  deleteObservacion
);

export default routerObservaciones;
