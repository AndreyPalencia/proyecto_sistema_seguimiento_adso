import models from '../../models/index.js';
const { Ficha, FichaAprendiz } = models;
import ApiResponse from '../../utils/apiResponse.js';

// Visualizar todas las fichas
export const getFichasByStateAndAprendiz = async (req, res) => {
  const { idAprendiz } = req.params;
  const { estadoFicha } = req.body;

  try {
    const fichasAprendiz = await FichaAprendiz.findAll({
      where: {
        idUsuario: idAprendiz,
      },
      include: [
        {
          model: Ficha,
          where: {
            estadoFicha: parseInt(estadoFicha), // <-- Filtro aplicado directamente
          },
          attributes: [
            'idFicha',
            'estadoFicha',
            'nombrePrograma',
            'numeroFicha',
          ], // puedes agregar más campos si deseas
        },
      ],
      order: [[{ model: Ficha }, 'numeroFicha', 'ASC']],
    });

    // Extraer solo el array de fichas relacionadas
    const fichas = fichasAprendiz.map((fichaApr) => fichaApr.Ficha);

    if (fichas.length === 0) {
      return ApiResponse.notFound(
        res,
        undefined,
        'No se encontraron fichas relacionadas al estado o aprendiz.'
      );
    }

    return ApiResponse.success(res, fichas, 'Fichas encontradas.');
  } catch (error) {
    console.error('Error al obtener fichas:', error);
    return ApiResponse.error(res, error, 'Error al obtener las fichas.');
  }
};
