import express from 'express';

import { validateParamsIds } from '../../middlewares/validateParamsIds.js';
import verifyToken from '../../middlewares/verifyToken.js';

//Importar controladores de ficha aprendiz
import { createFichaAprendiz } from '../../controllers/fichaAprendiz/createFichaAprendiz.js';
import { getFichaAprendiz } from '../../controllers/fichaAprendiz/getFichaAprendiz.js';
import { updateFichaAprendiz } from '../../controllers/fichaAprendiz/updateFichaAprendiz.js';
import { getAprendiesByFichas } from '../../controllers/fichaAprendiz/getAprendiesByFichas.js';
import { getFichaAprenidizByFichaAndAprendiz } from '../../controllers/fichaAprendiz/getFichaAprenidizByFichaAndAprendiz.js';
import { getAprendicesByEmpresa } from '../../controllers/fichaAprendiz/getAprendicesByEmpresa.js';

/* Rutas Agendamientos */

const routerFichaAprendiz = express.Router();

//Crear una relación entre una ficha  y un aprendiz
routerFichaAprendiz.post(
  '/',
  verifyToken(['admin', 'instructor']),
  createFichaAprendiz
);

//Obtener la relación entre una ficha  y un aprendiz  por [ID]
routerFichaAprendiz.get(
  '/ficha/:idFicha/usuario/:idUsuario',
  verifyToken(['*']),
  validateParamsIds,
  getFichaAprendiz
);

//Obtener la información de los aprendices de FichaAprendiz por [ID] ficha
routerFichaAprendiz.get(
  '/ficha/:idFicha',
  verifyToken(['admin', 'instructor']),
  validateParamsIds,
  getAprendiesByFichas
);

//Obtener la información relacionado a idfichaaprendiz por [ID]
routerFichaAprendiz.get(
  '/:idFichaAprendiz/info',
  verifyToken(['*']),
  validateParamsIds,
  getFichaAprenidizByFichaAndAprendiz
);

//Obtener aprendices relacionado a empresa y un instructor por [ID]
routerFichaAprendiz.get(
  '/empresa/:idEmpresa/instructor/:idInstructor',
  verifyToken(['*']),
  validateParamsIds,
  getAprendicesByEmpresa
);

//Modificar la relación entre una ficha  y un aprendiz por [ID]
routerFichaAprendiz.put(
  '/:idFichaAprendiz',
  verifyToken(['admin', 'instructor']),
  validateParamsIds,
  updateFichaAprendiz
);

export default routerFichaAprendiz;
