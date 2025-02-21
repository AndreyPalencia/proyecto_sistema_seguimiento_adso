import models from '../../models/index.js';
const { Agendamiento } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Modificar un agendamiento por ID
export const updateAgendamientoState = async (req, res) => {
  const idAgendamiento = req.params.idAgendamiento;
  const { estadoVisita } = req.body;

  if (!idAgendamiento) {
    return ApiResponse.badRequest(res, 'El id agendamiento es requerido');
  }

  if (estadoVisita === null || estadoVisita === undefined) {
    return ApiResponse.badRequest(res, 'El estado de la visita es requerido');
  }

  try {
    const updateRow = await Agendamiento.update({estadoVisita}, {
      where: {
        idAgendamiento,
      },
    });

    if (updateRow[0] === 0) {
      return ApiResponse.notFound(res, 'Agendamiento no encontrado o sin cambios');
    }

    return ApiResponse.success(
      res,
      undefined,
      'Agendamiento actualizado exitosamente'
    );
  } catch (error) {
    console.error('Error en la actualización del estado de la visita', error);
    return ApiResponse.error(
      res,
      error,
      'Error en la actualización del estado de la visita'
    );
  }
};
