import models from '../../models/index.js';
const { FichaAprendiz, Ficha, Usuario } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const getAprendiesByFichas = async (req, res) => {
  const { idFicha } = req.params;

  try {
    const aprendicesFicha = await FichaAprendiz.findAll({
      where: { idFicha },
      include: [
        {
          model: Usuario,
        },
      ],
    });

    if (!aprendicesFicha || aprendicesFicha.length === 0) {
      return ApiResponse.notFound(
        res,
        'No se encontraron aprendices relacionados con la ficha.'
      );
    }

    return ApiResponse.success(
      res,
      aprendicesFicha,
      'Estudiantes encontrados.'
    );
  } catch (error) {
    console.error(
      'Error al obtener los estudiantes de la FichaAprendiz:',
      error
    );
    return ApiResponse.error(res, error, 'Error al obtener los estudiantes.');
  }
};
