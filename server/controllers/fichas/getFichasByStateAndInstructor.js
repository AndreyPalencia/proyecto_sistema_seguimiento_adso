import models from '../../models/index.js';
const { Ficha } = models;
import ApiResponse from '../../utils/apiResponse.js';

// Visualizar todas las fichas
export const getFichasByStateAndInstructor = async (req, res) => {
  const { idInstructor } = req.params;
  const { estadoFicha } = req.body;
  try {
    const fichas = await Ficha.findAll({
      where: { estadoFicha, idInstructor },
    });
    if (fichas.length === 0) {
      return ApiResponse.error(
        res,
        undefined,
        'No se encontraron fichas relacionadas al estado o instructor.'
      );
    }
    return ApiResponse.success(res, fichas, 'Fichas encontradas.');
  } catch (error) {}
};
