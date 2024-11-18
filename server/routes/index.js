const express = require('express');
const router = express.Router();//Creacion de rutas

const usuariosController = require('../controllers/usuariosController'); //Controlador de fichas
const loginController = require('../controllers/loginController'); //Controllador de login
const upload = require('../config/multerConfig');

module.exports = () => {
    /* Rutas Usuarios */
    //Crear usuarios por archivo
    router.post('/crearUsuarioFile', upload.createUploadMiddleware('fileExcel'), usuariosController.crearUsuarioExcel);  //, usuariosController.crearUsuarioExcel);
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


    //Iniciar sesion
    router.post('/iniciarSesion', loginController.iniciarSesion)
    //navegar
    router.post('/navegar', loginController.navegar)
    //cerrar sesion
    router.post('/cerrarSesion', loginController.cerrarSesion)
    //cambiar Contraseña
    router.post('/cambiarPassword', loginController.cambiarContraseña)
    //recuperar contraseña
    router.post('/recuperarPassword', loginController.recuperarContraseña)
    return router;
    return router;
}