import models from '../../models/index.js';
const { FichaAprendiz } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const getFichaAprendiz = async (req, res) => {
  const { idFichaAprendiz } = req.params;

  try {
    const fichaAprendiz = await FichaAprendiz.findByPk(idFichaAprendiz);

    if (!fichaAprendiz) {
      return ApiResponse.notFound(
        res,
        'No se encontró la relación entre el aprendiz y la ficha.'
      );
    }

    return ApiResponse.success(res, fichaAprendiz, 'FichaAprendiz encontrada.');
  } catch (error) {
    console.error('Error al obtener la FichaAprendiz:', error);
    return ApiResponse.error(res, error, 'Error al obtener la FichaAprendiz.');
  }
};
