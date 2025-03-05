import models from '../../models/index.js';
const { Bitacora } = models;
import ApiResponse from '../../utils/apiResponse.js';
import fileHelpers from '../../utils/fileHelpers.js';

export const updateBitacora = async (req, res) => {
  const idBitacora = req.params.idBitacora;

  if (!idBitacora) {
    return ApiResponse.badRequest(res, 'El campo numero bitacora es requerido.');
  }

  try {
    if (req.file && req.file.filename) {
      req.body.bitacora = req.file.filename;
    }

    const updateRow = await Bitacora.update(req.body, {
      where: {
        idBitacora,
      },
    });

    if (updateRow[0] === 0) {
      return ApiResponse.notFound(
        res,
        'No se encontró la bitácora para actualizar.'
      );
    }

    const bitacoraActualizada = await Bitacora.findByPk(idBitacora);

    return ApiResponse.success(
      res,
      bitacoraActualizada,
      'Bitacora Actualizada correctamente'
    );
  } catch (error) {
    console.error('Error en la actualización de los datos:', error);
    await fileHelpers.rollbackFileOnError(filePath);
    return ApiResponse.error(res, undefined, 'Error al actualizar los datos.');
  }
};
