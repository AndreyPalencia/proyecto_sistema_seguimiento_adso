import models from '../../models/index.js';
const { Bitacora } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { getFileByName,deleteFileSafely } from '../../utils/fileHelpers.js';

export const deleteBitacora = async (req, res) => {
  const { idBitacora } = req.params;
  try {
    const bitacoraEliminada = await Bitacora.findByPk(idBitacora);

    if (!bitacoraEliminada) {
      return ApiResponse.notFound(
        res,
        'No se encontró la bitácora para actualizar.'
      );
    }

    await Bitacora.destroy({
      where: {
        idBitacora,
      },
    });

    const bitacoraFile = await getFileByName('bitacoras',bitacoraEliminada.nombreArchivo);

    await deleteFileSafely(bitacoraFile);
    

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
