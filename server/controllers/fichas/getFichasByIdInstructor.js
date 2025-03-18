import models from '../../models/index.js';
const { Ficha } = models;
import ApiResponse from '../../utils/apiResponse.js';

// Obtener una ficha por ID
export const getFichasByIdInstructor = async (req, res) => {
  const { idInstructor } = req.params;
  try {
    const getFichas = await Ficha.findAll({ where: { idInstructor } });
    if (!getFichas) {
      return ApiResponse.notFound(res, 'Fichas no encontradas.');
    }
    return ApiResponse.success(res, getFichas, 'Fichas obtenida con éxito.');
  } catch (error) {
    console.error('Error al obtener la ficha:', error);
    return ApiResponse.error(
      res,
      error,
      'Hubo un error al encontrar las fichas.'
    );
  }
};
