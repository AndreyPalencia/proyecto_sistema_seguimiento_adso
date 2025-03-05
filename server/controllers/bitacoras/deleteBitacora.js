import models from '../../models/index.js';
const { Bitacora } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const deleteBitacora = async (req, res) => {
  const idBitacora = req.params.idBitacora;

  if (!idBitacora) {
    return ApiResponse.badRequest(
      res,
      'El id bitácora es requerido.'
    );
  }

  try {
    await Bitacora.destroy({
      where: {
        idBitacora,
      },
    });

    const bitacoraEliminada = await Bitacora.findByPk(idBitacora);

    if (bitacoraEliminada !== null) {
      return ApiResponse.notFound(
        res,
        'No se encontró la bitácora para actualizar.'
      );
    }

    return ApiResponse.success(
      res,
      undefined,
      'Bitácora eliminada exitosamente.'
    );
  } catch (error) {
    console.error('Error en la eliminación de la bitácora:', error);
    return ApiResponse.error(
      res,
      undefined,
      'Error en la eliminación de la bitácora.'
    );
  }
};
