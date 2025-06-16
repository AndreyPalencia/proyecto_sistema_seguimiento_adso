import models from '../../models/index.js';
const { FichaAprendiz, Usuario, Ficha } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const getAprendicesByEmpresa = async (req, res) => {
  const { idEmpresa, idInstructor } = req.params;

  try {
    const fichasAprendices = await FichaAprendiz.findAll({
      where: { idEmpresa },
      attributes: ['idFichaAprendiz'],
      include: [
        {
          model: Usuario,
          attributes: [
            'idUsuario',
            'tipoDocumento',
            'numeroDocumento',
            'nombre',
            'apellido',
          ],
        },
        {
          model: Ficha,
          where: { idInstructor, estadoFicha: 1 },
          attributes: [],
        },
      ],
    });

    // Eliminar duplicados por idUsuario
    const aprendizMap = new Map();
    for (const fa of fichasAprendices) {
      const user = fa.Usuario;
      if (!aprendizMap.has(user.idUsuario)) {
        aprendizMap.set(user.idUsuario, {
          ...user.dataValues,
          idFichaAprendiz: fa.idFichaAprendiz,
        });
      }
    }

    const aprendicesUnicos = Array.from(aprendizMap.values());

    return ApiResponse.success(
      res,
      aprendicesUnicos,
      'Aprendices de la ficha encontrados.'
    );
  } catch (error) {
    console.error('Error al obtener los aprendices por ficha:', error);
    return ApiResponse.error(
      res,
      error,
      'Error al obtener los aprendices por ficha.'
    );
  }
};
