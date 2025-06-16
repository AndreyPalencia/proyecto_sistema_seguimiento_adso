import models from '../../models/index.js';
const { FichaAprendiz, Ficha, Usuario, Empresa } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const getFichaAprenidizByFichaAndAprendiz = async (req, res) => {
  const { idFichaAprendiz } = req.params;

  try {
    const aprendiz = await FichaAprendiz.findOne({
      where: { idFichaAprendiz },
      include: [
        {
          model: Usuario, // Relación con Usuario
          required: false, // Indica si la relación es obligatoria o no
        },
        {
          model: Ficha, // Relación con Ficha
          required: false, // Puedes ajustarlo según si quieres hacer un LEFT JOIN
          include: [
            {
              model: Usuario, // Usuario que es instructor de la ficha
              required: false,
              attributes: ['correoElectronico', 'telefono', 'nombre', 'apellido'],
            },
          ],
        },
        {
          model: Empresa, // Relación con Empresa
          required: false, // Puedes ajustarlo según si quieres hacer un LEFT JOIN
        },
      ],
    });

    if (!aprendiz) {
      return ApiResponse.notFound(
        res,
        'No se encontraron aprendiz relacionados con la ficha.'
      );
    }

    return ApiResponse.success(res, aprendiz, 'Aprediz encontrado.');
  } catch (error) {
    console.error(
      'Error al obtener los estudiantes de la FichaAprendiz:',
      error
    );
    return ApiResponse.error(res, error, 'Error al obtener los estudiantes.');
  }
};
