import express from 'express';

import { validateParamsIds } from '../../middlewares/validateParamsIds.js';
import verifyToken from '../../middlewares/verifyToken.js';

//Importacion de rutas al modelo
import { createFicha } from '../../controllers/fichas/createFicha.js';
import { getFichaById } from '../../controllers/fichas/getFichaById.js';
import { updateFicha } from '../../controllers/fichas/updateFicha.js';
import { updateFichaState } from '../../controllers/fichas/updateFichaState.js';
import { getFichasByStateAndInstructor } from '../../controllers/fichas/getFichasByStateAndInstructor.js';
import { getFichasByStateAndAprendiz } from '../../controllers/fichas/getFichasByStateAndAprendiz.js';

/* Rutas Fichas */

const routerFichas = express.Router();

//Crear un ficha
routerFichas.post('/', verifyToken(['admin', 'instructor']), createFicha);

//Visualizar fichas por ID de instructor
routerFichas.post(
  '/instructor/:idInstructor',
  verifyToken(['admin', 'instructor']),
  validateParamsIds,
  getFichasByStateAndInstructor
);

routerFichas.post(
  '/aprendiz/:idAprendiz',
  verifyToken(['admin', 'aprendiz']),
  validateParamsIds,
  getFichasByStateAndAprendiz
);

//Visualizar una ficha por ID
routerFichas.get(
  '/:idFicha',
  verifyToken(['*']),
  validateParamsIds,
  getFichaById
);

//Modificar una ficha por [ID]
routerFichas.put(
  '/:idFicha',
  verifyToken(['admin', 'instructor']),
  validateParamsIds,
  updateFicha
);

//Modificar el estado de una ficha por [ID]
routerFichas.patch(
  '/:idFicha/estado',
  verifyToken(['admin', 'instructor']),
  validateParamsIds,
  updateFichaState
);

export default routerFichas;
