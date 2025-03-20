import models from '../../models/index.js';
const { Ficha } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Actualizar ficha por ID
export const updateFichaState = async (req, res) => {
  const { idFicha } = req.params;
  const { estadoFicha } = req.body;

  if (estadoFicha == null) {
    return ApiResponse.badRequest(res, 'No se mando el estado de la ficha.');
  }

  try {
    const [updateRow] = await Ficha.update(
      { estadoFicha },
      {
        where: { idFicha: idFicha },
      }
    );

    if (updateRow === null) {
      return ApiResponse.notFound(res, 'No se encontro la ficha.');
    }

    return ApiResponse.success(res, undefined, 'Estado actualizado con éxito.');
  } catch (error) {
    console.error('Error al actualizar el estado de la ficha:', error);
    return ApiResponse.error(
      res,
      error,
      'Error al actualizar el estado de la ficha.'
    );
  }
};
