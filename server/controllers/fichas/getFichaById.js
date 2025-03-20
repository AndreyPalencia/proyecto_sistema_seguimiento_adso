import models from '../../models/index.js';
const { Ficha } = models;
import ApiResponse from '../../utils/apiResponse.js';

// Obtener una ficha por ID
export const getFichaById = async (req, res) => {
  const { idFicha } = req.params;

  try {
    const getFicha = await Ficha.findByPk(idFicha);
    if (!getFicha) {
      return ApiResponse.notFound(res, 'Ficha no encontrada.');
    }
    return ApiResponse.success(res, getFicha, 'Ficha obtenida con éxito.');
  } catch (error) {
    console.error('Error al obtener la ficha:', error);
    return ApiResponse.error(
      res,
      error,
      'Hubo un error al encontrar la ficha.'
    );
  }
};
