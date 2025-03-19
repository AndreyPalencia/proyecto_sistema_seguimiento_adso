import models from '../../models/index.js';
const { Documento } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { deleteFileSafely } from '../../utils/fileHelpers.js';

export const createDocumento = async (req, res) => {
  try {
    if (req.file && req.file.filename) {
      req.body.nombreDocumento = req.file.filename;
    }
    const documento = await Documento.create(req.body);
    return ApiResponse.created(res, documento, 'Documento subido.');
  } catch (error) {
    console.error('Error en al subir el documento:', error);
    if (req.file && req.file.filename) {
      await deleteFileSafely(req.filePath);
    }
    return ApiResponse.error(res, error, 'No se pudo subir el documento.');
  }
};
