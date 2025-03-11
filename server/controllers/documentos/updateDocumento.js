import models from '../../models/index.js';
const { Documento } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { rollbackFileOnError } from '../../utils/fileHelpers.js';

export const updateDocumento = async (req, res) => {
  const { idDocumento } = req.params;

  try {
    if (req.file && req.file.filename) {
      req.body.nombreDocumento = req.file.filename;
    }

    const [upadatedCount] = await Documento.update(req.body, {
      where: {
        idDocumento,
      },
    });

    if (upadatedCount === 0) {
      return ApiResponse.notFound(
        res,
        'No se encontró el documento o no hubo cambios.'
      );
    }

    const documentoActualizado = await Documento.findByPk(idDocumento);

    return ApiResponse.success(
      res,
      documentoActualizado,
      'Documento Actualizado exitosamente.'
    );
  } catch (error) {
    console.error('Error al actualizar el documento:', error);
    await rollbackFileOnError(filePath);
    return ApiResponse.error(
      res,
      undefined,
      'Error al actualizar el documento'
    );
  }
};
