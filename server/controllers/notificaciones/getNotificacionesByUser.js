import models from '../../models/index.js';
const { Notificacion } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const getNotificacionByUser = async (req, res) => {
  const { idUsuario } = req.params;


  try {
    const notificaciones = await Notificacion.findAll({ where: { idUsuario } });

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
