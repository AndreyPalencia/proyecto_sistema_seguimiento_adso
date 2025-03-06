import express from 'express';

//Importar middleware
import { validateAuth } from '../../middleware/validateAuth.js';

//Importar las rutas de authentification
import { loginUser } from '../../authentication/loginUser.js';
import { logoutUser } from '../../authentication/logoutUser.js';
import { changePassword } from '../../authentication/changePassword.js';
import { resetPasswordRequest } from '../../authentication/resetPasswordRequest.js';
import { resetPasswordConfirm } from '../../authentication/resetPasswordConfirm.js';

/* Rutas Autentificacion */

const routerAuthentification = express.Router();

//Inciar sesion
routerAuthentification.post('/login', validateAuth, loginUser);

//Cerrar sesion
routerAuthentification.post('/logout', logoutUser);

//Cambiar Contraseña
routerAuthentification.patch('/change-password', changePassword);

//Solicitar la recuperación de la contraseña por correo
routerAuthentification.post('/reset-password/request', resetPasswordRequest);

//Realizar el cambio de la contraseña através del token
routerAuthentification.post('/reset-password/confirm', resetPasswordConfirm);

export default routerAuthentification;
