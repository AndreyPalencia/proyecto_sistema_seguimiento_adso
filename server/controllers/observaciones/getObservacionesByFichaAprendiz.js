import models from '../../models/index.js';
const { Observacion } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const getObservacionesByFichaAprendiz = async (req, res) => {
  const { idFichaAprendiz } = req.params;
  const { rol } = req.user;

  try {
    const hasAcess = rol === 'aprendiz';
    const observaciones = await Observacion.findAll({
      where: {
        idFichaAprendiz,
        ...(hasAcess ? { mostrarObservacion: 1 } : {}),
      },
    });

    if (!observaciones.length) {
      return ApiResponse.notFound(res, 'No se encontraron observaciones.');
    }

    return ApiResponse.success(
      res,
      observaciones,
      'Observaciones encontradas.'
    );
  } catch (error) {
    console.error('Error al obtener observaciones:', error);
    return ApiResponse.error(res, 'Error al obtener observaciones.', error);
  }
};
