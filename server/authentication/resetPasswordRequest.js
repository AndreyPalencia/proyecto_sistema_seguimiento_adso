import models from '../models/index.js';
const { Usuario } = models;
import jwt from 'jsonwebtoken';
import { sendPasswordRecoverEmail } from './auth.email.js';
import ApiResponse from '../utils/apiResponse.js';
const { SECRET_JWT_KEY } = process.env;

export const resetPasswordRequest = async (req, res) => {
  const { correoElectronico } = req.body;

  if (
    !correoElectronico ||
    correoElectronico === undefined ||
    correoElectronico === null
  ) {
    return ApiResponse.badRequest(res, 'El correo electrónico es requerido.');
  }

  try {
    const usuario = await Usuario.findOne({
      where: {
        correoElectronico,
      },
    });

    if (!usuario ) {
      return ApiResponse.notFound(
        res,
        'Usuario no encontrado o cuenta inactiva.'
      );
    }

    //Generar token JWT para recuperar contraseña
    const tokenRecuperacion = jwt.sign(
      {
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre,
        correoElectronico: usuario.correoElectronico,
      },
      SECRET_JWT_KEY,
      { expiresIn: '30m' }
    );

    const emailSend = await sendPasswordRecoverEmail(
      usuario,
      tokenRecuperacion
    );

    if (!emailSend.success) {
      console.error('Error al enviar correo de recuperación:', emailSend.error);
      return ApiResponse.error(
        res,
        emailSend.error.message,
        'Error al enviar correo de recuperación'
      );
    }

    return ApiResponse.success(
      res,
      undefined,
      'Se envio el correo recuperación con exito.'
    );
  } catch (error) {
    console.error('Error en el proceso de recuperación', error);
    return ApiResponse.error(res,error, 'Error en el proceso de recuperación');
  }
};
