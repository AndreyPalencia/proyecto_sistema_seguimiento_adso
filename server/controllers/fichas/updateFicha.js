import models from '../../models/index.js';
const { Ficha } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Actualizar ficha por ID
export const updateFicha = async (req, res) => {
  const { idFicha } = req.params;
  try {
    const [updateRow] = await Ficha.update(req.body, {
      where: { idFicha: idFicha },
      individualHooks: true,
    });
    if (updateRow === 0) {
      return ApiResponse.notFound(res, 'No se encontró la ficha.');
    }
    const updateFicha = await Ficha.findByPk(idFicha);
    return ApiResponse.success(
      res,
      updateFicha,
      'Ficha actualizada con éxito.'
    );
  } catch (error) {
    console.error('Error al actualizar la ficha:', error);
    return ApiResponse.error(res, error, 'Error al actualizar la ficha.');
  }
};
