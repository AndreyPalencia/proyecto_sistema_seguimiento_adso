const express = require('express');
const router = express.Router();//Creacion de rutas

const usuariosController = require('../controllers/usuariosController'); //Controlador de fichas
const loginController = require('../auth/autentificacion'); //Controllador de login
const upload = require('../config/multerConfig');

/* Rutas Usuarios */

//Crear usuarios por archivo
router.post('/crearUsuarioFile', upload.createUploadMiddleware('filesExcel'), usuariosController.crearUsuarioExcel);  //, usuariosController.crearUsuarioExcel);
//Crear usuario
router.post('/crearUsuario', upload.createUploadMiddlewareOptional('firmas'), usuariosController.crearUsuario);
//Visualizar usuarios por [id]
router.post('/visualizarUsuarios', usuariosController.obtenerUsuarios);
//Visualizar usuario por [id]
router.get('/:idUsuario', usuariosController.obtenerUsuarioPorId);
//Modificar usuarios por [id]
router.put('/:idUsuario', upload.createUploadMiddlewareOptional('firmas'), usuariosController.modificarUsuario);
//Eliminar usuarios
router.patch('/:idUsuario/cambiarEstadoUsuario', usuariosController.cambiarEstadoUsuario);


module.exports = router;