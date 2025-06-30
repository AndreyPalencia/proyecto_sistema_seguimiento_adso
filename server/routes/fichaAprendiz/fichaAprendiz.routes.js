import express from 'express';
import { createUploadMiddleware } from '../../config/multerConfig.js';

import { validateParamsIds } from '../../middlewares/validateParamsIds.js';
import verifyToken from '../../middlewares/verifyToken.js';

//Importar controladores de ficha aprendiz
import { createFichaAprendiz } from '../../controllers/fichaAprendiz/createFichaAprendiz.js';
import { getFichaAprendiz } from '../../controllers/fichaAprendiz/getFichaAprendiz.js';
import { updateFichaAprendiz } from '../../controllers/fichaAprendiz/updateFichaAprendiz.js';
import { getAprendiesByFichas } from '../../controllers/fichaAprendiz/getAprendiesByFichas.js';
import { getFichaAprenidizByFichaAndAprendiz } from '../../controllers/fichaAprendiz/getFichaAprenidizByFichaAndAprendiz.js';
import { getAprendicesByEmpresa } from '../../controllers/fichaAprendiz/getAprendicesByEmpresa.js';
import { createAprendicesFichasByExcel } from '../../controllers/fichaAprendiz/createAprendicesFichasByExcel.js';

/* Rutas Agendamientos */

const routerFichaAprendiz = express.Router();

// Configuración para subida obligatoria (allowEmpty: false)
const uploadRequired = createUploadMiddleware('temporal', {
  allowedExtensions: ['.xlsx'],
  maxFileSize: 4 * 1024 * 1024,
  allowEmpty: true, // Requiere archivo obligatorio
});

//Crear una relación entre una ficha  y un aprendiz
routerFichaAprendiz.post(
  '/',
  verifyToken(['admin', 'instructor']),
  createFichaAprendiz
);

//Crear relacion-aprendices y ficha por archivo xlsx o excel
routerFichaAprendiz.post(
  '/ficha/:idFicha/aprendices-excel',
  verifyToken(['admin', 'instructor']),
  uploadRequired,
  createAprendicesFichasByExcel
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
