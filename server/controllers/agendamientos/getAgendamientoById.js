import models from '../../models/index.js';
const { Agendamiento } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { transformarAgendamiento } from '../../utils/agendamientos.js';

//Obtener Agendamiento
export const getAgendamientoById = async (req, res) => {
  const { idAgendamiento } = req.params;
  try {
    const agendamiento = await Agendamiento.findByPk(idAgendamiento, {
      include: [
        {
          model: FichaAprendiz,
          attributes: ['idFichaAprendiz'],
          include: [
            {
              model: Ficha,
              attributes: ['idFicha'],
            },
          ],
        },
      ],
    });

    if (!agendamiento) {
      return ApiResponse.notFound(res, 'Agendamiento no encontrado.');
    }

    const agendamientoTransfromado = transformarAgendamiento(agendamiento);

    return ApiResponse.success(
      res,
      agendamientoTransfromado,
      'Agendamiento encontrado.'
    );
  } catch (error) {
    console.error('Error en la obtener el agendamiento:', error);
    return ApiResponse.error(
      res,
      error,
      'Error en la obtener el agendamiento.'
    );
  }
};
