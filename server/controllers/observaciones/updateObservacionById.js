import models from '../../models/index.js';
const { Observacion } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const updateObservacionById = async (req, res) => {
  const { idObservacion } = req.params;
  try {
    const [updatedCount] = await Observacion.update(req.body, {
      where: { idObservacion },
    });

    if (updatedCount === 0) {
      return ApiResponse.notFound(
        res,
        'No se encontró la observación o no hubo cambios.'
      );
    }

    const updatedObservacion = Observacion.findByPk(idObservacion);

    return ApiResponse.success(
      res,
      updatedObservacion,
      'Observación actualizada.'
    );
  } catch (error) {
    console.error('Error en la actualizacion de la observación:', error);
    return ApiResponse.error(res, error, 'Error al actualizar la observación.');
  }
};
