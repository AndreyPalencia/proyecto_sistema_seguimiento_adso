import models from '../../models/index.js';
const { Bitacora } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Modificar un agendamiento por ID
export const updateBitacoraState = async (req, res) => {
  const { idBitacora } = req.params;
  const { estadoBitacora } = req.body;

  if (estadoBitacora == null) {
    return ApiResponse.badRequest(res, 'El estado de la bitacora es requerido.');
  }

  try {
    const [updateRow] = await Bitacora.update(
      { estadoBitacora },
      {
        where: { idBitacora },
      }
    );

    if (updateRow === 0) {
      return ApiResponse.notFound(res, 'Bitacora no encontrada.');
    }

    return ApiResponse.success(
      res,
      undefined,
      'Bitacora actualizada exitosamente.'
    );
  } catch (error) {
    console.error('Error en la actualización del estado de la visita:', error);
    return ApiResponse.error(
      res,
      error,
      'Error en la actualización del estado de la visita.'
    );
  }
};
