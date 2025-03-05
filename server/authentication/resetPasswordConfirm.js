import models from '../models/index.js';
const { Usuario } = models;
import jwt from 'jsonwebtoken';
import { sendResetPasswordConfirmationEmail } from './auth.email.js';
import ApiResponse from '../utils/apiResponse.js';
import encryptionUtil from '../utils/encryptionUtil.js';
const { SECRET_JWT_KEY } = process.env;

export const resetPasswordConfirm = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    if (!token || !newPassword || newPassword.length < 8) {
      return ApiResponse.badRequest(
        res,
        'Token inválido o contraseña es muy corta.'
      );
    }

    const usuarioDecodificado = jwt.verify(token, SECRET_JWT_KEY);

    const newPasswordHash = await encryptionUtil.hashPassword(newPassword);

    const [updateRow] = await Usuario.update(
      { password: newPasswordHash },
      {
        where: {
          correoElectronico: usuarioDecodificado.correoElectronico,
        },
      }
    );

    if (updateRow === 0) {
      return ApiResponse.notFound(res, 'Usuario no encontrado.');
    }

    const emailSend = await sendResetPasswordConfirmationEmail(
      usuarioDecodificado
    );

    if (!emailSend.success) {
      console.error('Error al enviar correo de recuperación:', emailSend.error);
      return ApiResponse.error(
        res,
        emailSend.error.message,
        'Error al enviar correo de recuperación.'
      );
    }
    return ApiResponse.success(
      res,
      undefined,
      'Contraseña actualizada correctamente.'
    );
  } catch (error) {
    return ApiResponse.error(res, error, 'Token invalido o expirado.');
  }
};
