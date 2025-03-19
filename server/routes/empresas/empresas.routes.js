import express from 'express';
import { validateParamsIds } from '../../middlewares/validateParamsIds.js';

//Importar controladores de empresas
import { createEmpresa } from '../../controllers/empresas/createEmpresa.js';
import { getEmpresa } from '../../controllers/empresas/getEmpresa.js';
import { updateEmpresa } from '../../controllers/empresas/updateEmpresa.js';
import { deleteEmpresa } from '../../controllers/empresas/deleteEmpresa.js';

/* Rutas Empresas */

const routerEmpresas = express.Router();

//Crear usuario
routerEmpresas.post('/', createEmpresa);

//Visualizar usuario por [ID]
routerEmpresas.get('/:idEmpresa', validateParamsIds, getEmpresa);

//Modificar usuarios por [ID]
routerEmpresas.put('/:idEmpresa', validateParamsIds, updateEmpresa);

//Cambiar estado por [ID] del usuario
routerEmpresas.delete('/:idEmpresa', validateParamsIds, deleteEmpresa);

export default routerEmpresas;
