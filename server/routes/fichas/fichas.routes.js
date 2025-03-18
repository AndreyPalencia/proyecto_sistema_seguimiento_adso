import express from 'express';

import { validateParamsIds } from '../../middleware/validateParamsIds.js';

//Importacion de rutas al modelo
import { createFicha } from '../../controllers/fichas/createFicha.js';
import { getFichaById } from '../../controllers/fichas/getFichaById.js';
import { updateFicha } from '../../controllers/fichas/updateFicha.js';
import { updateFichaState } from '../../controllers/fichas/updateFichaState.js';
import { getFichasByIdInstructor } from '../../controllers/fichas/getFichasByIdInstructor.js';

/* Rutas Fichas */

const routerFichas = express.Router();

//Crear un ficha
routerFichas.post('/', createFicha);

//Visualizar una ficha por ID
routerFichas.get('/:idFicha', getFichaById);

//Visualizar fichas por ID de instructor
routerFichas.get(
  '/instructor/:idInstructor',
  validateParamsIds,
  getFichasByIdInstructor
);

//Modificar una ficha por [ID]
routerFichas.put('/:idFicha', updateFicha);

//Modificar el estado de una ficha por [ID]
routerFichas.patch('/:idFicha/estado', updateFichaState);

export default routerFichas;
