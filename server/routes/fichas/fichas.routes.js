import express from 'express';

import { validateParamsIds } from '../../middlewares/validateParamsIds.js';

//Importacion de rutas al modelo
import { createFicha } from '../../controllers/fichas/createFicha.js';
import { getFichaById } from '../../controllers/fichas/getFichaById.js';
import { updateFicha } from '../../controllers/fichas/updateFicha.js';
import { updateFichaState } from '../../controllers/fichas/updateFichaState.js';
import { getFichasByStateAndInstructor } from '../../controllers/fichas/getFichasByStateAndInstructor.js';

/* Rutas Fichas */

const routerFichas = express.Router();

//Crear un ficha
routerFichas.post('/', createFicha);

//Visualizar fichas por ID de instructor
routerFichas.post(
  '/instructor/:idInstructor',
  validateParamsIds,
  getFichasByStateAndInstructor
);

//Visualizar una ficha por ID
routerFichas.get('/:idFicha', validateParamsIds, getFichaById);

//Modificar una ficha por [ID]
routerFichas.put('/:idFicha', validateParamsIds, updateFicha);

//Modificar el estado de una ficha por [ID]
routerFichas.patch('/:idFicha/estado', validateParamsIds, updateFichaState);

export default routerFichas;
