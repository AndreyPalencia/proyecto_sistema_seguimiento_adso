import models from '../../models/index.js';
const { Observacion } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const updateObservacionState = async (req, res) => {
  const idObservacion = req.params.idObservacion;
  const { mostrarObservacion } = req.body;

  if (!idObservacion) {
    return ApiResponse.badRequest(res, 'El id observación es requerido.');
  }

  if (mostrarObservacion == null) {
    return ApiResponse.badRequest(
      res,
      'El estado de la observación no esta definido correctamente.'
    );
  }

  try {
    const [updatedCount] = await Observacion.update(
      { mostrarObservacion },
      {
        where: {
          idObservacion,
        },
      }
    );
    if (updatedCount === 0) {
      return ApiResponse.notFound(
        res,
        'No se encontró la observación o no hubo cambios.'
      );
    }

    return ApiResponse.success(
      res,
      undefined,
      'Estado de observación actualizada.'
    );
  } catch (error) {
    console.error('Error en la actualizacion de la observación:', error);
    return ApiResponse.error(res, error, 'Error al actualizar la observación.');
  }
};
