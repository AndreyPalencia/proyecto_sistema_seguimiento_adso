import express from 'express';

//Importar middleware
import { validateAuth } from '../../middlewares/validateAuth.js';
import verifyToken from '../../middlewares/verifyToken.js';

//Importar las rutas de authentification
import { loginUser } from '../../authentication/loginUser.js';
import { logoutUser } from '../../authentication/logoutUser.js';
import { perfilUser } from '../../authentication/perfilUser.js';
import { changePassword } from '../../authentication/changePassword.js';
import { resetPasswordRequest } from '../../authentication/resetPasswordRequest.js';
import { resetPasswordConfirm } from '../../authentication/resetPasswordConfirm.js';
import { changePasswordByAdmin } from '../../authentication/changePasswordByAdmin.js';

/* Rutas Autentificacion */

const routerAuthentification = express.Router();

//Inciar sesion
routerAuthentification.post('/login', validateAuth, loginUser);

//Cerrar sesion
routerAuthentification.post('/logout', logoutUser);

//Validar usuairo
routerAuthentification.post('/validated-user', perfilUser);

//Cambiar Contraseña
routerAuthentification.patch(
  '/change-password',
  verifyToken(['*']),
  changePassword
);

//Cambiar Contraseña de otro usuario si endo admin
routerAuthentification.patch(
  '/change-password-admin',
  verifyToken(['admin']),
  changePasswordByAdmin
);

//Solicitar la recuperación de la contraseña por correo
routerAuthentification.post('/reset-password/request', resetPasswordRequest);

//Realizar el cambio de la contraseña através del token
routerAuthentification.post(
  '/reset-password/confirm',
  verifyToken(['*']),
  resetPasswordConfirm
);

export default routerAuthentification;
