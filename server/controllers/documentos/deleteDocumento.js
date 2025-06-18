import models from '../../models/index.js';
const { Documento } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { deleteFileSafely, getFileByName } from '../../utils/fileHelpers.js';

export const deleteDocumento = async (req, res) => {
  const { idDocumento } = req.params;

  try {
    const documento = await Documento.findByPk(idDocumento);

    if (!documento) {
      return ApiResponse.notFound(res, 'No se encontró el documento.');
    }

    await Documento.destroy({ where: { idDocumento } });

    const documentoFile = await getFileByName('documentos', documento.nombreDocumento);

    await deleteFileSafely(documentoFile);

    return ApiResponse.success(
      res,
      undefined,
      'Documento eliminado exitosamente.'
    );
  } catch (error) {
    console.error('Error al eliminar el documento:', error);
    return ApiResponse.error(res, undefined, 'Error al eliminar el documento.');
  }
};
