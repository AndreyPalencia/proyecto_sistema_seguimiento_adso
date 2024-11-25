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
router.get('/visualizarUsuario/:idUsuario', usuariosController.obtenerUsuarioPorId);
//Modificar usuarios por [id]
router.put('/modificarUsuario/:idUsuario', upload.createUploadMiddlewareOptional('firmas'), usuariosController.modificarUsuario);
//Eliminar usuarios
router.patch('/cambiarEstadoUsuario/:idUsuario', usuariosController.cambiarEstadoUsuario);


module.exports = router;