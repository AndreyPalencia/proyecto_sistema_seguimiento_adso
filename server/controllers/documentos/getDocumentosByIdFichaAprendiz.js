import models from '../../models/index.js';
const { Documento } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const getDocumentosByIdFichaAprendiz = async (req, res) => {
  const { idFichaAprendiz } = req.params;

  try {
    const documentos = await Documento.findAll({
      where: {
        idFichaAprendiz,
      },
    });

    if (documentos.length === 0) {
      return ApiResponse.notFound(
        res,
        [],
        'No se encontraron documentos relacionados al aprendiz.'
      );
    }

    return ApiResponse.success(
      res,
      documentos,
      'Documentos encontrados exitosamente.'
    );
  } catch (error) {
    console.error(
      'Error en la encontrar los documentos relacionados con id FichaAprendiz:',
      error
    );
    return ApiResponse.error(
      res,
      error,
      'Error en la encontrar los documentos relacionados con id FichaAprendiz'
    );
  }
};
