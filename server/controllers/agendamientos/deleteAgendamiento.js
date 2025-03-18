import models from '../../models/index.js';
const { Agendamiento } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Obtener Agendamiento
export const deleteAgendamiento = async (req, res) => {
  const { idAgendamiento } = req.params;
  try {
    const agendamiento = await Agendamiento.findByPk(idAgendamiento);

    if (!agendamiento) {
      return ApiResponse.notFound(res, 'Agendamiento no encontrado.');
    }

    await Agendamiento.destroy({ where: { idAgendamiento } });

    return ApiResponse.success(
      res,
      undefined,
      'Agendamiento borrado exitosamente.'
    );

  } catch (error) {
    console.error('Error al eliminar el agendamiento:', error);
    return ApiResponse.error(res, error, 'Error al eliminar el agendamiento.');
  }
};
