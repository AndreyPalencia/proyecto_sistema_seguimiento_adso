import models from '../../models/index.js';
const { Bitacora } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { rollbackFileOnError } from '../../utils/fileHelpers.js';

export const createBitacora = async (req, res) => {
  try {
    if (req.file && req.file.filename) {
      req.body.bitacora = req.file.filename;
    }
    const bitacora = await Bitacora.create(req.body);
    return ApiResponse.created(res, bitacora, 'Bitácora subida.');
  } catch (error) {
    console.error('Error en la creación de la bitácora:', error);
    await rollbackFileOnError(req.filePath);
    return ApiResponse.error(res, error, 'No se pudo subir la bitácora.');
  }
};
