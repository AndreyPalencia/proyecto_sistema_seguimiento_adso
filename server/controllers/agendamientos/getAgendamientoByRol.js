import models from '../../models/index.js';
const { Agendamiento } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Obtener todos los Agendamientos

export const getAgendamientoByRol = async (req, res) => {
  const { idFichaAprendiz, idInstructor } = req.body;
  try {
    const filtros = {};
    if (idFichaAprendiz) {
      filtros.idFichaAprendiz = idFichaAprendiz;
    }
    if (idInstructor) {
      filtros.idInstructor = idInstructor;
    }
    const agendamientosObtenidos = await Agendamiento.findAll({
      where: filtros,
    });
    if (agendamientosObtenidos.length === 0) {
      return ApiResponse.notFound(res, 'No se encontraron agendamientos');
    }
    return ApiResponse.success(
      res,
      agendamientosObtenidos,
      'Agendamientos obtenidos exitosamente'
    );
  } catch (error) {
    console.error('Error al obtener los agendamientos:', error);
    return ApiResponse.error(res, error, 'Error al obtener Agendamientos');
  }
};
