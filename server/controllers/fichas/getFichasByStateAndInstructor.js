import models from '../../models/index.js';
const { Ficha } = models;
import ApiResponse from '../../utils/apiResponse.js';

// Visualizar todas las fichas
export const getFichasByStateAndInstructor = async (req, res) => {
  const { idInstructor } = req.params;
  const { estadoFicha } = req.body;
  try {
    let filtros = { idInstructor };
    if (estadoFicha) {
      filtros.estadoFicha = estadoFicha;
    }
    const fichas = await Ficha.findAll({
      where: filtros,
      order: [['numeroFicha', 'ASC']],
    });
    if (fichas.length === 0) {
      return ApiResponse.notFound(
        res,
        undefined,
        'No se encontraron fichas relacionadas al estado o instructor.'
      );
    }
    return ApiResponse.success(res, fichas, 'Fichas encontradas.');
  } catch (error) {
    console.error('Error al obtener fichas:', error);
    return ApiResponse.error(res, error, 'Error al obtener las fichas.');
  }
};
