import express from 'express';

import { validateParamsIds } from '../../middlewares/validateParamsIds.js';
import verifyToken from '../../middlewares/verifyToken.js';

//Importar controladores de empresas
import { createEmpresa } from '../../controllers/empresas/createEmpresa.js';
import { getEmpresa } from '../../controllers/empresas/getEmpresa.js';
import { updateEmpresa } from '../../controllers/empresas/updateEmpresa.js';
import { deleteEmpresa } from '../../controllers/empresas/deleteEmpresa.js';
import { searchEmpresas } from '../../controllers/empresas/searchEmpresas.js';

/* Rutas Empresas */

const routerEmpresas = express.Router();

//Crear empresa
routerEmpresas.post('/', verifyToken(['admin', 'instructor']), createEmpresa);

//Buscar por filtros
routerEmpresas.post(
  '/buscar',
  verifyToken(['admin', 'instructor']),
  searchEmpresas
);

//Visualizar empresa por [ID]
routerEmpresas.get(
  '/:idEmpresa',
  verifyToken(['*']),
  validateParamsIds,
  getEmpresa
);

//Modificar empresa por [ID]
routerEmpresas.put(
  '/:idEmpresa',
  verifyToken(['admin', 'instructor']),
  validateParamsIds,
  updateEmpresa
);

//Cambiar estado por [ID] del empresa
routerEmpresas.delete(
  '/:idEmpresa',
  verifyToken(['admin', 'instructor']),
  validateParamsIds,
  deleteEmpresa
);

export default routerEmpresas;
