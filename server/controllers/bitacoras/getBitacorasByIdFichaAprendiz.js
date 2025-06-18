import models from '../../models/index.js';
const { Bitacora } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const getBitacorasByIdFichaAprendiz = async (req, res) => {
  const { idFichaAprendiz } = req.params;

  try {
    const bitacoras = await Bitacora.findAll({
      where: {
        idFichaAprendiz,
      },
      order: [['numeroBitacora']],
    });

    if (bitacoras.length === 0) {
      return ApiResponse.notFound(
        res,
        [],
        'No se encontraron bitácoras realcionadas al idFichaAprendiz.'
      );
    }

    return ApiResponse.success(
      res,
      bitacoras,
      'Bitácora visualizada exitosamente.'
    );
  } catch (error) {
    console.error('Error en la visualización de los datos:', error);
    return ApiResponse.error(
      res,
      error,
      'Error en la visualización de la bitácora.'
    );
  }
};
