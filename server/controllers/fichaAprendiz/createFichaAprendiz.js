import models from '../../models/index.js';
const { FichaAprendiz } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const createFichaAprendiz = async (req, res) => {
  try {
    const fichaAprendizCreado = await FichaAprendiz.create(req.body);

    return ApiResponse.created(
      res,
      fichaAprendizCreado,
      'Se creo exitosamente la realcion entre el aprendiz y la ficha.'
    );
  } catch (error) {
    console.error(
      'Error al crear la relacion entre el aprendiz y la ficha:',
      error
    );
    return ApiResponse.error(
      res,
      error,
      'Error al crear la relacion entre el aprendiz y la ficha.'
    );
  }
};
