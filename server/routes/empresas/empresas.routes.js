import express from 'express';

// Importar controladores de empresas
import { createEmpresa } from '../../controllers/empresas/createEmpresa.js';
import { getEmpresa } from '../../controllers/empresas/getEmpresa.js';
import { updateEmpresa } from '../../controllers/empresas/updateEmpresa.js';
import { deleteEmpresa } from '../../controllers/empresas/deleteEmpresa.js';

/* Rutas Empresas */
const routerEmpresas = express.Router();

//Crear usuario
routerEmpresas.post('/', createEmpresa);

//Visualizar usuario por [ID]
routerEmpresas.get('/:idEmpresa', getEmpresa);

//Modificar usuarios por [ID]
routerEmpresas.put('/:idEmpresa', updateEmpresa);

//Cambiar estado por [ID] del usuario
routerEmpresas.delete('/:idEmpresa', deleteEmpresa);

export default routerEmpresas;
