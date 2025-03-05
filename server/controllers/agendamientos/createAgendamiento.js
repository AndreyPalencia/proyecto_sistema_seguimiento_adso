import models from '../../models/index.js';
const { Agendamiento } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Crear Agendamiento
export const createAgendamiento = async (req, res) => {
  try {
    const agendamientoCreado = await Agendamiento.create(req.body);

    return ApiResponse.created(
      res,
      agendamientoCreado,
      'Agendamiento creado exitosamente.'
    );
  } catch (error) {
    console.error('Error al crear el agendamiento:', error);
    return ApiResponse.error(res, error, 'Error al crear el agendamiento.');
  }
};
