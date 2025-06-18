import express from 'express';
import { createUploadMiddleware } from '../../config/multerConfig.js';
import verifyToken from '../../middlewares/verifyToken.js';

import { validateParamsIds } from '../../middlewares/validateParamsIds.js';
import { validateUserCreate } from '../../middlewares/validateUserCreate.js';
import { validateUserUpdate } from '../../middlewares/validateUserUpdate.js';

//Importar controladores de usuarios
import { createUsuario } from '../../controllers/usuarios/createUsuario.js';
import { searchUsuarios } from '../../controllers/usuarios/searchUsuarios.js';
import { getUsuarioById } from '../../controllers/usuarios/getUsuarioById.js';
import { updateUsuarioById } from '../../controllers/usuarios/updateUsuarioById.js';
import { updateUsuarioState } from '../../controllers/usuarios/updateUsuarioState.js';
import { getUsuarios } from '../../controllers/usuarios/getUsuarios.js';

/* Rutas Usuarios */

const routerUsuarios = express.Router();

// Configuración para subida obligatoria (allowEmpty: false)
// const uploadRequired = createUploadMiddleware('firmas', {
//   allowedExtensions: ['.png', '.jpg', '.jpeg'],
//   maxFileSize: 4 * 1024 * 1024,
//   allowEmpty: false, // Requiere archivo obligatorio
// });

// Configuración para permitir actualización sin archivo (allowEmpty: true)
const uploadOptional = createUploadMiddleware('firmas', {
  allowedExtensions: ['.png', '.jpg', '.jpeg'],
  maxFileSize: 4 * 1024 * 1024,
  allowEmpty: true, // Permite no subir archivo
});

//Crear usuario
routerUsuarios.post(
  '/',
  verifyToken(['admin', 'instructor']),
  uploadOptional,
  validateUserCreate,
  createUsuario
);

//Visualizar los usuarios por filtros
routerUsuarios.post(
  '/buscar',
  verifyToken(['admin', 'instructor']),
  searchUsuarios
);

//Visualizar usuario por [ID]
routerUsuarios.get(
  '/:idUsuario',
  verifyToken(['*']),
  validateParamsIds,
  getUsuarioById
);

//Visualizar usuarios
routerUsuarios.get(
  '',
  verifyToken(['admin']),
  validateParamsIds,
  getUsuarios
);

//Modificar usuarios por [ID]
routerUsuarios.put(
  '/:idUsuario',
  verifyToken(['*']),
  validateParamsIds,
  uploadOptional,
  validateUserUpdate,
  updateUsuarioById
);

//Cambiar estado por [ID] del usuario
routerUsuarios.patch(
  '/:idUsuario/estado',
  verifyToken(['admin', 'instructor']),
  validateParamsIds,
  updateUsuarioState
);

export default routerUsuarios;
