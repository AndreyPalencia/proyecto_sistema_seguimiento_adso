import models from '../models/index.js';
const { Usuario } = models;
import ApiResponse from '../utils/apiResponse.js';
import { deleteFileSafely } from '../utils/fileHelpers.js';
import { Op } from 'sequelize';

// Middleware para validar usuario en creación o actualización
export const validateUserCreate = async (req, res, next) => {
  const { numeroDocumento, correoElectronico } = req.body;

  if (!numeroDocumento || !correoElectronico) {
    if (req.file) deleteFileSafely(req.file.path);
    return ApiResponse.error(
      res,
      null,
      'Número de documento y correo electrónico son obligatorios.'
    );
  }

  try {
    // Verificamos si ya existe un usuario con el mismo número de documento o correo electrónico
    const usuarioExistente = await Usuario.findOne({
      where: {
        [Op.or]: [{ numeroDocumento }, { correoElectronico }],
      },
    });

    if (usuarioExistente) {
      if (req.file) deleteFileSafely(req.file.path);
      return ApiResponse.error(
        res,
        null,
        'Ya existe un usuario con el número de documento o correo electrónico proporcionado.'
      );
    }

    next();
  } catch (error) {
    console.error('Error al validar usuario:', error);
    if (req.file) deleteFileSafely(req.file.path);
    return ApiResponse.error(res, error, 'Error al validar usuario.');
  }
};
