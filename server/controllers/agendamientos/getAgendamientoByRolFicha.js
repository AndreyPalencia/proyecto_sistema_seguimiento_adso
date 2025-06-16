import models from '../../models/index.js';
const { Agendamiento, FichaAprendiz, Ficha } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { transformarAgendamiento } from '../../utils/agendamientos.js';

//Obtener todos los Agendamientos

export const getAgendamientoByRolFicha = async (req, res) => {
  const { idFichaAprendiz, idInstructor, idFicha, estadoVisita } = req.body;
  try {
    const filtros = {};
    if (idFichaAprendiz) {
      filtros.idFichaAprendiz = idFichaAprendiz;
    }
    if (idInstructor) {
      filtros.idInstructor = idInstructor;
    }
    if (estadoVisita) {
      filtros.estadoVisita = estadoVisita;
    }
    const agendamientosObtenidos = await Agendamiento.findAll({
      where: filtros,
      include: [
        {
          model: FichaAprendiz,
          attributes: ['idFichaAprendiz'],
          where: idFicha ? { idFicha } : undefined,
          include: [
            {
              model: Ficha,
              attributes: ['idFicha'],
            },
          ],
        },
      ],
      order: [['numeroVisita']],
    });
    // Transformar los agendamientos
    const agendamientosTransformados = agendamientosObtenidos.map(
      transformarAgendamiento
    );

    if (agendamientosObtenidos.length === 0) {
      return ApiResponse.notFound(res, [], 'No se encontraron agendamientos.');
    }
    return ApiResponse.success(
      res,
      agendamientosTransformados,
      'Agendamientos obtenidos exitosamente.'
    );
  } catch (error) {
    console.error('Error al obtener los agendamientos:', error);
    return ApiResponse.error(res, error, 'Error al obtener agendamientos.');
  }
};
