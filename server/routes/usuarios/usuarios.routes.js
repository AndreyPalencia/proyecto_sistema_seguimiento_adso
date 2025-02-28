import express from 'express';
import { createUploadMiddleware } from '../../config/multerConfig.js';

// Importar controladores de usuarios
import { createUsuario } from '../../controllers/usuarios/createUsuario.js';
import { searchUsuarios } from '../../controllers/usuarios/searchUsuarios.js';
import { getUsuarioById } from '../../controllers/usuarios/getUsuarioById.js';
import { updateUsuarioById } from '../../controllers/usuarios/updateUsuarioById.js';
import { updateUsuarioState } from '../../controllers/usuarios/updateUsuarioState.js';

/* Rutas Usuarios */

const routerUsuarios = express.Router();

//Crear usuarios por archivo
//router.post('/crearUsuarioFile', createUploadMiddleware('filesExcel'), crearUsuarioExcel);

//Crear usuario
routerUsuarios.post('/', createUploadMiddleware('firmas'), createUsuario);

//Visualizar los usuarios por filtros
routerUsuarios.post('/buscar', searchUsuarios);

//Visualizar usuario por [ID]
routerUsuarios.get('/:idUsuario', getUsuarioById);

//Modificar usuarios por [ID]
routerUsuarios.put(
  '/:idUsuario',
  createUploadMiddleware('firmas', true),
  updateUsuarioById
);

//Cambiar estado por [ID] del usuario
routerUsuarios.patch('/:idUsuario/estado', updateUsuarioState);

export default routerUsuarios;
