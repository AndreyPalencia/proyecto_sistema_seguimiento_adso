import models from '../../models/index.js';
const { Bitacora } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { getFileByName, deleteFileSafely } from '../../utils/fileHelpers.js';

export const updateBitacora = async (req, res) => {
  const { idBitacora } = req.params;

  try {
    const bitacora = await Bitacora.findByPk(idBitacora);
    
    const oldFileBitacora = await getFileByName('bitacoras', bitacora.bitacora);

    if (req.file && req.file.filename) {
      req.body.bitacora = req.file.filename; 
    }

    const [updateRow] = await Bitacora.update(req.body, {
      where: {
        idBitacora,
      },
    });

    if (req.file && req.file.filename && oldFileBitacora) {
      await deleteFileSafely(oldFileBitacora);
    }

    if (updateRow === 0) {
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
    if (req.file && req.file.filename) {
      await deleteFileSafely(req.filePath);
    }
    return ApiResponse.error(res, undefined, 'Error al actualizar los datos.');
  }
};
