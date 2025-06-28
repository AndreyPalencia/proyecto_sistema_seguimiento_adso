import models from '../models/index.js';
const { Usuario } = models;
import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/apiResponse.js';
import encryptionUtil from '../utils/encryptionUtil.js';
const { SECRET_JWT_KEY } = process.env;

export const changePasswordByAdmin = async (req, res) => {
  const token = req.cookies.acceso_token;
  const { idUsuario, newPassword } = req.body;

  if (!token) return ApiResponse.badRequest(res, 'Token requerido.');
  if (!idUsuario || !newPassword)
    return ApiResponse.badRequest(res, 'Faltan datos requeridos.');

  try {
    // Validar que el token pertenece a un admin
    const dataUsuario = jwt.verify(token, SECRET_JWT_KEY);

    const admin = await Usuario.findByPk(dataUsuario.idUsuario);
    if (!admin || admin.rol !== 'admin') {
      return ApiResponse.unauthorized(res, 'No autorizado.');
    }

    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) return ApiResponse.notFound(res, 'Usuario no encontrado.');

    // Verificar que la nueva contraseña no sea igual a la actual
    if (await encryptionUtil.comparePassword(newPassword, usuario.password)) {
      return ApiResponse.badRequest(
        res,
        'La nueva contraseña no puede ser igual a la anterior.'
      );
    }

    const newPasswordHash = await encryptionUtil.hashPassword(newPassword);

    const [updatedRows] = await Usuario.update(
      { password: newPasswordHash },
      {
        where: {
          idUsuario: usuario.idUsuario,
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
      'Contraseña actualizada correctamente por el administrador.'
    );
  } catch (error) {
    console.error('Error al cambiar la contraseña como admin:', error);
    return ApiResponse.error(res, error, 'Error al cambiar la contraseña.');
  }
};
