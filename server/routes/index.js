const express = require('express');
const router = express.Router();//Creacion de rutas

const usuariosController = require('../controller/usuariosController'); //Controlador de fichas
const upload = require('../config/multerConfig');

module.exports = () => {
    /* Rutas Usuarios */
    //Crear usuarios por archivo
    router.post('/crearUsuarioFile', upload.createUploadMiddleware('fileExcel'), usuariosController.crearUsuarioExcel);  //, usuariosController.crearUsuarioExcel);
    //Crear usuario
    router.post('/crearUsuario',upload.createUploadMiddlewareOptional('firmas'), usuariosController.crearUsuario);
    //Visualizar usuarios por [id]
    router.post('/visualizarUsuarios', usuariosController.obtenerUsuario);
    //Visualizar usuario por [id]
    router.get('/visualizarUsuario/:idUsuario', usuariosController.obtenerUsuarioPorId);
    //Modificar usuarios por [id]
    router.put('/modificarUsuario/:idUsuario',upload.createUploadMiddlewareOptional('firmas'), usuariosController.modificarUsuario);
    //Eliminar usuarios
    router.patch('/cambiarEstadoUsuario/:idUsuario',usuariosController.cambiarEstadoUsuario)
    return router;
}