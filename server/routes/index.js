const express = require('express');
const router = express.Router();//Creacion de rutas

const usuariosController = require('../controller/usuariosController'); //Controlador de fichas
const createUploadMiddleware = require('../config/multerConfig');

module.exports = () => {
    /* Rutas Usuarios */
    //Crear usuarios por archivo
    router.post('/archivo', createUploadMiddleware('fileExcel'), usuariosController.crearUsuarioExcel); //, usuariosController.crearUsuarioExcel);
    //Crear usuario
    router.post('/crearUsuario',createUploadMiddleware('firmas'), usuariosController.crearUsuario);
    //Visualizar usuarios por [id]
    router.get('/visualizarUsuario', usuariosController.obtenerUsuario);
    //Visualizar usuario por [id]
    router.get('/visualizarUsuario/:id_usuario', usuariosController.obtenerUsuarioPorId);
    //Modificar usuarios por [id]
    router.put('/modificarUsuario', usuariosController.modificarUsuario);
    //Eliminar usuarios
    router.put('/eliminarUsuario',usuariosController.eliminarUsuario)
    return router;
}