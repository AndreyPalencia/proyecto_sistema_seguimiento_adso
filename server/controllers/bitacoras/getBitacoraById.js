import models from '../../models/index.js';
const { Bitacora } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const getBitacoraById = async (req, res) => {
  const idBitacora = req.params.idBitacora;

  if (!idBitacora) {
    return ApiResponse.badRequest(
      res,
      'El campo numero bitacora es requerido.'
    );
  }

  try {
    const bitacora = await Bitacora.findByPk(idBitacora);

    if (!bitacora) {
      return ApiResponse.notFound(res, 'Bitacora no encontrada');
    }

    return ApiResponse.success(res, bitacora, 'Bitacora Obtenida exitosamente');
  } catch (error) {
    console.error('Error en la obtener la bitacora', error);
    return ApiResponse.error(res, error, 'Error en la obtener la bitacora');
  }
};
