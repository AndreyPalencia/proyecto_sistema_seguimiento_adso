import models from '../../models/index.js';
const { Empresa } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const deleteEmpresa = async (req, res) => {
  const idEmpresa = req.params.idEmpresa;

  // Validación de id_empresa
  if (!idEmpresa) {
    return ApiResponse.badRequest(res, 'El id_empresa es requerido');
  }
  try {
    await Empresa.destroy({
      where: {
        idEmpresa,
      },
    });

    const empresa = await Empresa.findByPk(idEmpresa);
    if (empresa === null) {
      return ApiResponse.success(res, 'Empresa eliminada con éxito');
    }
    return ApiResponse.notFound(res, 'Empresa no encontrada');
  } catch (error) {
    console.error('Error en la eliminacion de la empresa', error);
    return ApiResponse.error(
      res,
      error,
      'Error en la eliminacion de la empresa'
    );
  }
};
