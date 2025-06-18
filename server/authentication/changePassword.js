import models from '../models/index.js';
const { Usuario } = models;
import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/apiResponse.js';
import encryptionUtil from '../utils/encryptionUtil.js';
const { SECRET_JWT_KEY } = process.env;

export const changePassword = async (req, res) => {
  const token = req.cookies.acceso_token;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return ApiResponse.badRequest(
      res,
      'Se deben proporcionar la contraseña actual y la nueva contraseña.'
    );

  if (!token) return ApiResponse.badRequest(res, 'Token requerido.');

  try {
    //Obtengo los datos de cookiees
    const dataUsuario = jwt.verify(token, SECRET_JWT_KEY);

    const usuario = await Usuario.findByPk(dataUsuario.idUsuario);

    if (!usuario) return ApiResponse.notFound(res, 'Usuario no encontrado.');

    const verifyPassword = await encryptionUtil.comparePassword(
      currentPassword,
      usuario.password
    );

    if (!verifyPassword) {
      return ApiResponse.badRequest(
        res,
        'El usuario o contraseña es incorrecta.'
      );
    }

    // Encripto la nueva contraseña
    const newPasswordHash = await encryptionUtil.hashPassword(newPassword);

    // Verificar que la nueva contraseña no sea igual a la anterior
    if (await encryptionUtil.comparePassword(newPassword, usuario.password)) {
      return ApiResponse.badRequest(
        res,
        'La nueva contraseña no puede ser igual a la anterior.'
      );
    }

    // Actualizar la contraseña
    const [updatedRows] = await Usuario.update(
      { password: newPasswordHash },
      {
        where: {
          idUsuario: usuario.idUsuario, // Asegúrate de que este campo es correcto
        },
      }
    );
    if (updatedRows === 0) {
      return ApiResponse.error(
        res,
        null,
        'No se pudo actualizar la contraseña.'
      );
    }

    return ApiResponse.success(
      res,
      undefined,
      'Contraseña actualizada correctamente.'
    );
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    return ApiResponse.error(res, error, 'Error al cambiar la contraseña.');
  }
};
