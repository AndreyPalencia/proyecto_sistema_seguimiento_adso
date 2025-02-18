import express from 'express';
import { createUploadMiddleware } from '../../config/multerConfig.js';

// Importar controladores de usuarios
import { createUsuario } from '../../controllers/usuarios/createUsuario.js';
import { getUsuarios } from '../../controllers/usuarios/getUsuarios.js';
import { getUsuarioById } from '../../controllers/usuarios/getUsuarioById.js';
import { updateUsuarioById } from '../../controllers/usuarios/updateUsuarioById.js';
import { updateUsuarioState } from '../../controllers/usuarios/updateUsuarioState.js';

//Creacion de rutas
const routerUsuarios = express.Router();

/* Rutas Usuarios */
//Crear usuarios por archivo
//router.post('/crearUsuarioFile', createUploadMiddleware('filesExcel'), crearUsuarioExcel);

//Crear usuario
routerUsuarios.post(
  '/crearUsuario',
  createUploadMiddleware('firmas'),
  createUsuario
);

//Visualizar los usuarios
routerUsuarios.post('/visualizarUsuarios', getUsuarios);

//Visualizar usuario por [ID]
routerUsuarios.get('/:idUsuario', getUsuarioById);

//Modificar usuarios por [ID]
routerUsuarios.put(
  '/:idUsuario',
  createUploadMiddleware('firmas', true),
  updateUsuarioById
);

//Cambiar estado por [ID] del usuario
routerUsuarios.post('/:idUsuario/estadoUsuario', updateUsuarioState);

export default routerUsuarios;
