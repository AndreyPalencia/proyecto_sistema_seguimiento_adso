import models from '../../models/index.js';
const { Notificacion } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const updateNotificacionState = async (req, res) => {
  const { idNotificacion } = req.params;
  const { estado } = req.body;

  if (estado == null) {
    return ApiResponse.badRequest(
      res,
      'No se envío el estado de la notificación.'
    );
  }

  try {
    const [updatedCount] = await Notificacion.update(
      { estado },
      {
        where: {
          idNotificacion,
        },
      }
    );

    if (updatedCount === 0) {
      return ApiResponse.notFound(
        res,
        'No se encontró la notificación o no hubo cambios.'
      );
    }

    return ApiResponse.success(
      res,
      undefined,
      'Estado de notificación actualizada.'
    );
  } catch (error) {
    console.error('Error al actualizar el estado de la notificación:', error);
    return ApiResponse.error(
      res,
      error,
      'Error al actualizar el estado de la notificación.'
    );
  }
};
