import models from '../../models/index.js';
const { Observacion } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const deleteObservacion = async (req, res) => {
  const { idObservacion } = req.params;

  try {
    const observacion = Observacion.findByPk(idObservacion);

    if (!observacion) {
      return ApiResponse.notFound(res, 'No se encontró la observación.');
    }

    await Observacion.destroy({ where: { idObservacion } });

    return ApiResponse.success(
      res,
      undefined,
      'Observación borrada con éxito.'
    );
  } catch (error) {
    console.error('Error al borrar la observación:', error);
    return ApiResponse.error(res, error, 'Error al borrar la observación.');
  }
};
