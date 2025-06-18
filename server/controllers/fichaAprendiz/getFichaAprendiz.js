import models from '../../models/index.js';
const { FichaAprendiz, Usuario, Ficha } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const getFichaAprendiz = async (req, res) => {
  const { idFicha, idUsuario } = req.params;

  try {
    const fichaAprendiz = await FichaAprendiz.findOne({
      where: { idUsuario: idUsuario, idFicha: idFicha },
      include: [
        {
          model: Usuario,
        },
        {
          model: Ficha,
          attributes: ['idInstructor'],
        },
      ],
    });

    return ApiResponse.success(
      res,
      fichaAprendiz || [],
      'FichaAprendiz encontrada.'
    );
  } catch (error) {
    console.error('Error al obtener la FichaAprendiz:', error);
    return ApiResponse.error(res, error, 'Error al obtener la FichaAprendiz.');
  }
};
