import express from 'express';
import { validateParamsIds } from '../../middlewares/validateParamsIds.js';

//Importar controladores de usuarios
import { createAgendamiento } from '../../controllers/agendamientos/createAgendamiento.js';
import { getAgendamientoByRol } from '../../controllers/agendamientos/getAgendamientoByRol.js';
import { getAgendamientoById } from '../../controllers/agendamientos/getAgendamientoById.js';
import { updateAgendamiento } from '../../controllers/agendamientos/updateAgendamiento.js';
import { deleteAgendamiento } from '../../controllers/agendamientos/deleteAgendamiento.js';
import { updateAgendamientoState } from '../../controllers/agendamientos/updateAgendamientoState.js';

/* Rutas Agendamientos */

const routerAgendamientos = express.Router();

//Crear un nuevo agendamiento
routerAgendamientos.post('/', createAgendamiento);

//Obtener todos los agendamientos
routerAgendamientos.post('/rol', 
    validateParamsIds, 
    getAgendamientoByRol
);

//Obtener un agendamiento por [ID]
routerAgendamientos.get(
  '/:idAgendamiento',
  validateParamsIds,
  getAgendamientoById
);

//Modificar un agendamiento por [ID]
routerAgendamientos.put(
  '/:idAgendamiento',
  validateParamsIds,
  updateAgendamiento
);

//Actualizar el estado de la visita de un agendamiento
routerAgendamientos.patch(
  '/:idAgendamiento/estado',
  validateParamsIds,
  updateAgendamientoState
);

//Eliminar un agendamiento por [ID]
routerAgendamientos.delete(
  '/:idAgendamiento',
  validateParamsIds,
  deleteAgendamiento
);

/*Notas: Visualizacion de agendamientos por filtro del metodo de ? */

export default routerAgendamientos;
