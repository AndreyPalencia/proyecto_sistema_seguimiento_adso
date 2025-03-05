import models from '../../models/index.js';
const { Agendamiento } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Obtener Agendamiento
export const getAgendamientoById = async (req, res) => {
  const idAgendamiento = req.params.idAgendamiento;

  if (!idAgendamiento) {
    return ApiResponse.badRequest(res, 'El id agendamiento es requerido.');
  }

  try {
    const agendamiento = await Agendamiento.findByPk(idAgendamiento);

    if (!agendamiento) {
      return ApiResponse.notFound(res, 'Agendamiento no encontrado.');
    }

    return ApiResponse.success(res, agendamiento, 'Agendamiento encontrado.');
  } catch (error) {
    console.error('Error en la obtener el agendamiento:', error);
    return ApiResponse.error(res, error, 'Error en la obtener el agendamiento.');
  }
};
