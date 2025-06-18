import express from 'express';

import { validateParamsIds } from '../../middlewares/validateParamsIds.js';
import verifyToken from '../../middlewares/verifyToken.js';

//Importar controladores de usuarios
import { createAgendamiento } from '../../controllers/agendamientos/createAgendamiento.js';
import { getAgendamientoByRolFicha } from '../../controllers/agendamientos/getAgendamientoByRolFicha.js';
import { getAgendamientoById } from '../../controllers/agendamientos/getAgendamientoById.js';
import { updateAgendamiento } from '../../controllers/agendamientos/updateAgendamiento.js';
import { deleteAgendamiento } from '../../controllers/agendamientos/deleteAgendamiento.js';
import { updateAgendamientoState } from '../../controllers/agendamientos/updateAgendamientoState.js';

/* Rutas Agendamientos */

const routerAgendamientos = express.Router();

//Crear un nuevo agendamiento
routerAgendamientos.post('/', verifyToken(['*']), createAgendamiento);

//Obtener todos los agendamientos por el rol
routerAgendamientos.post(
  '/rol',
  verifyToken(['*']),
  validateParamsIds,
  getAgendamientoByRolFicha
);

//Obtener un agendamiento por [ID]
routerAgendamientos.get(
  '/:idAgendamiento',
  verifyToken(['*']),
  validateParamsIds,
  getAgendamientoById
);

//Modificar un agendamiento por [ID]
routerAgendamientos.put(
  '/:idAgendamiento',
  verifyToken(['admin', 'instructor']),
  validateParamsIds,
  updateAgendamiento
);

//Actualizar el estado de la visita de un agendamiento
routerAgendamientos.patch(
  '/:idAgendamiento/estado',
  verifyToken(['admin', 'instructor']),
  validateParamsIds,
  updateAgendamientoState
);

//Eliminar un agendamiento por [ID]
routerAgendamientos.delete(
  '/:idAgendamiento',
  verifyToken(['admin', 'instructor']),
  validateParamsIds,
  deleteAgendamiento
);

/*Notas: Visualizacion de agendamientos por filtro del metodo de ? */

export default routerAgendamientos;
