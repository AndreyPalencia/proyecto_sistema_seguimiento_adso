import express from 'express';
import { createUploadMiddleware } from '../../config/multerConfig.js';
import { validateParamsIds } from '../../middlewares/validateParamsIds.js';

//Importar controladores de usuarios
import { createUsuario } from '../../controllers/usuarios/createUsuario.js';
import { searchUsuarios } from '../../controllers/usuarios/searchUsuarios.js';
import { getUsuarioById } from '../../controllers/usuarios/getUsuarioById.js';
import { updateUsuarioById } from '../../controllers/usuarios/updateUsuarioById.js';
import { updateUsuarioState } from '../../controllers/usuarios/updateUsuarioState.js';

/* Rutas Usuarios */

const routerUsuarios = express.Router();

//Crear usuario
routerUsuarios.post('/', createUploadMiddleware('firmas'), createUsuario);

//Visualizar los usuarios por filtros
routerUsuarios.post('/buscar', searchUsuarios);

//Visualizar usuario por [ID]
routerUsuarios.get('/:idUsuario', validateParamsIds, getUsuarioById);

//Modificar usuarios por [ID]
routerUsuarios.put(
  '/:idUsuario',
  validateParamsIds,
  createUploadMiddleware('firmas', true),
  updateUsuarioById
);

//Cambiar estado por [ID] del usuario
routerUsuarios.patch(
  '/:idUsuario/estado',
  validateParamsIds,
  updateUsuarioState
);

export default routerUsuarios;
