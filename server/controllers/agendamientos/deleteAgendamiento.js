import models from '../../models/index.js';
const { Agendamiento } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Obtener Agendamiento
export const deleteAgendamiento = async (req, res) => {
  const idAgendamiento = req.params.idAgendamiento;

  if (!idAgendamiento) {
    return ApiResponse.badRequest(res, 'El id agendamiento es requerido.');
  }

  try {
    await Agendamiento.destroy({ where: { idAgendamiento } });

    const agendamiento = await Agendamiento.findByPk(idAgendamiento);

    if (agendamiento === null) {
      return ApiResponse.success(
        res,
        undefined,
        'Agendamiento borrado exitosamente.'
      );
    }

    return ApiResponse.notFound(res, 'Agendamiento no encontrado.');
  } catch (error) {
    console.error('Error al eliminar el agendamiento:', error);
    return ApiResponse.error(res, error, 'Error al eliminar el agendamiento.');
  }
};
