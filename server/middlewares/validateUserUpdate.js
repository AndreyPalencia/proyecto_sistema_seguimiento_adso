import models from '../models/index.js';
const { Usuario } = models;
import ApiResponse from '../utils/apiResponse.js';
import { deleteFileSafely } from '../utils/fileHelpers.js';
import { Op } from 'sequelize';

// Middleware para validar usuario en creación o actualización
export const validateUserUpdate = async (req, res, next) => {
  const { numeroDocumento, correoElectronico } = req.body;
  const { idUsuario } = req.params; // ID del usuario (solo para actualización)

  
  // Si no se proporcionan numeroDocumento ni correoElectronico, saltamos la validación
  if (!numeroDocumento && !correoElectronico) {
    console.log(req.body.firma, 'Dato sin validar, se omite validación');
    return next(); // NO eliminar archivo, porque puede venir por ejemplo solo firma
  }
  
  try {
    // Condiciones para evitar conflictos al comparar solo los campos presentes
    const whereCondition = {
      [Op.or]: [],
    };

    if (numeroDocumento) {
      whereCondition[Op.or].push({ numeroDocumento });
    }

    if (correoElectronico) {
      whereCondition[Op.or].push({ correoElectronico });
    }

    const usuarioExistente = await Usuario.findOne({
      where: {
        ...whereCondition,
        idUsuario: { [Op.ne]: idUsuario }, // Evita que un usuario se compare consigo mismo
      },
    });

    // Verificamos si ya existe un usuario con el mismo numeroDocumento o correoElectronico
    if (usuarioExistente) {
      if (req.file) deleteFileSafely(req.file.path);
      return ApiResponse.error(
        res,
        null,
        'Ya existe un usuario con el número de documento o correo electrónico proporcionado.'
      );
    }

    next(); // Pasamos al siguiente middleware si no hay conflictos
  } catch (error) {
    console.error('Error al validar usuario:', error);
    if (req.file) deleteFileSafely(req.file.path);
    return ApiResponse.error(res, error, 'Error al validar usuario.');
  }
};
