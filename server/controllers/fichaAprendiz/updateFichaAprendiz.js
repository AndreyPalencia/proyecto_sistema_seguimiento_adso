import models from '../../models/index.js';
const { FichaAprendiz } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const updateFichaAprendiz = async (req, res) => {
  const { idFichaAprendiz } = req.params;
  const nuevosDatos = req.body;

  try {
    const [updatedCount] = await FichaAprendiz.update(nuevosDatos, {
      where: { idFichaAprendiz },
    });

    if (updatedCount === 0) {
      return ApiResponse.notFound(
        res,
        'No se encontró la FichaAprendiz o no hubo cambios en los datos.'
      );
    }

    const fichaAprendizActualizada = await FichaAprendiz.findByPk(
      idFichaAprendiz
    );

    return ApiResponse.success(
      res,
      fichaAprendizActualizada,
      'FichaAprendiz actualizada exitosamente.'
    );
  } catch (error) {
    console.error('Error al actualizar la FichaAprendiz:', error);
    return ApiResponse.error(
      res,
      error,
      'Error al actualizar los datos de la FichaAprendiz.'
    );
  }
};
