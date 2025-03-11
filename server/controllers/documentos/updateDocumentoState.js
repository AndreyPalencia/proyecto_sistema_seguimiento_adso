import models from '../../models/index.js';
const { Documento } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Modificar un agendamiento por ID
export const updateDocumentoState = async (req, res) => {
  const { idDocumento } = req.params;
  const { estadoDocumento } = req.body;

  if (estadoDocumento == null) {
    return ApiResponse.badRequest(
      res,
      'El estado de la documento es requerido.'
    );
  }

  try {
    const [updatedCount] = await Documento.update(
      { estadoDocumento },
      {
        where: {
          idDocumento,
        },
      }
    );

    if (updatedCount === 0) {
      return ApiResponse.notFound(
        res,
        'No se encontró el documento o no hubo cambios.'
      );
    }

    return ApiResponse.success(
      res,
      undefined,
      'Documento actualizado exitosamente.'
    );
  } catch (error) {
    console.error('Error al actualizar el estado del documento:', error);
    return ApiResponse.error(
      res,
      error,
      'Error al actualizar el estado del documento'
    );
  }
};
