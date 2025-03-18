import models from '../../models/index.js';
const { Agendamiento } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Modificar un agendamiento por ID
export const updateAgendamiento = async (req, res) => {
  const { idAgendamiento } = req.params;

  try {
    const [updateRow] = await Agendamiento.update(req.body, {
      where: {
        idAgendamiento: idAgendamiento,
      },
    });

    if (updateRow === 0) {
      return ApiResponse.notFound(res, 'Agendamiento no encontrado.');
    }

    const agendamientoActualizado = await Agendamiento.findByPk(idAgendamiento);

    return ApiResponse.success(
      res,
      agendamientoActualizado,
      'Agendamiento actualizado exitosamente.'
    );
  } catch (error) {
    console.error(
      'Error en la actualización de los datos del Agendamiento:',
      error
    );
    return ApiResponse.error(
      res,
      error,
      'Error en la actualizacion de los datos del Agendamiento.'
    );
  }
};
