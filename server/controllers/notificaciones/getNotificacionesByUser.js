import models from '../../models/index.js';
const { Notificacion } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { Op } from 'sequelize';

export const getNotificacionByUser = async (req, res) => {
    const { idUsuario } = req.params; // El middleware ya lo valida
    const { estados } = req.body;
  try {
    // Usar el nombre correcto del campo en la base de datos
    let filtros = { id_usuario: idUsuario };

    // Agregar filtro de estados si se envió en la petición
    if (estados && Array.isArray(estados)) {
      filtros.estado = { [Op.in]: estados };
    }

    // Consultar las notificaciones con los filtros correctos
    const notificaciones = await Notificacion.findAll({ where: filtros });
    if (!notificaciones.length) {
      return ApiResponse.notFound(
        res,
        'No se encontró notificaciones asociadas al usuario.'
      );
    }

    return ApiResponse.success(
      res,
      notificaciones,
      'Notificaciones obtenidas exitosamente.'
    );
  } catch (error) {
    console.error(
      'Error al obtener las notificaciones asociadas al usuario:',
      error
    );
    return ApiResponse.error(
      res,
      error,
      'Error al obtener las notificaciones asociadas al usuario.'
    );
  }
};
