const express = require('express');
const router = express.Router();//Creacion de rutas

const autentificacion = require('../../auth/autentificacion'); //Controllador de login

/* Rutas Autentificacion */

router.post('/login', autentificacion.iniciarSesion);
//navegar
//cerrar sesion
router.post('/logout', autentificacion.cerrarSesion);
//cambiar Contraseña
router.patch('/resetPassword', autentificacion.cambiarContrasenia);
//recuperar contraseña
router.post('/recoverPassword', autentificacion.recuperarContrasenia);


module.exports = router;