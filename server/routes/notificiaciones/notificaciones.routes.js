import express from 'express';
import { validateParamsIds } from '../../middleware/validateParamsIds.js';

//Importacion de rutas al modelo
import { createNotificacion } from '../../controllers/notificaciones/createNotificacion.js';
import { getNotificacionByUser } from '../../controllers/notificaciones/getNotificacionesByUser.js';
import { updateNotificacionState } from '../../controllers/notificaciones/updateNotificacionState.js';

/* Rutas Notificaciones */

const routerNotificaciones = express.Router();

//Crear una notificación
routerNotificaciones.post('/', createNotificacion);

//Visualizar las notificaciones obtenida por [ID] de usuario
routerNotificaciones.get(
  '/:idUsuario/usuario',
  validateParamsIds,
  getNotificacionByUser
);

//Modificar estado de notificación por [ID]
routerNotificaciones.patch(
  '/:idNotificacion/estado',
  validateParamsIds,
  updateNotificacionState
);

export default routerNotificaciones;
