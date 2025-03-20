import models from '../../models/index.js';
const { Documento } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { deleteFileSafely, getFileByName } from '../../utils/fileHelpers.js';

export const updateDocumento = async (req, res) => {
  const { idDocumento } = req.params;

  try {
    const documentoFile = await Documento.findByPk(idDocumento);

    const oldFileDocumento = documentoFile.nombreDocumento
      ? await getFileByName('documentos', documentoFile.nombreDocumento)
      : null;

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
        'La actulización no se puedo compleatar. Verifique los datos.'
      );
    }

    if (req.file?.filename && oldFileDocumento) {
      await deleteFileSafely(oldFileDocumento);
    }
    const documentoActualizado = await Documento.findByPk(idDocumento);

    return ApiResponse.success(
      res,
      documentoActualizado,
      'Documento Actualizado exitosamente.'
    );
  } catch (error) {
    console.error('Error al actualizar el documento:', error);
    if (req.file && req.file.filename) {
      await deleteFileSafely(req.filePath);
    }
    return ApiResponse.error(
      res,
      undefined,
      'Error al actualizar el documento'
    );
  }
};
