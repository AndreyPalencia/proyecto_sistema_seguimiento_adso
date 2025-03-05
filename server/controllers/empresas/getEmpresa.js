import models from '../../models/index.js';
const { Empresa } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Visualizar empresa por ID
export const getEmpresa = async (req, res) => {
  const idEmpresa = req.params.idEmpresa;

  // Validación de id_empresa
  if (!idEmpresa) {
    return ApiResponse.badRequest(res, 'El id_empresa es requerido.');
  }

  try {
    // Consultar la empresa con ambos parámetros
    const empresa = await Empresa.findByPk(idEmpresa);

    // Verificar si la empresa existe
    if (empresa === null) {
      return ApiResponse.notFound(res, 'Empresa no encontrado.');
    }

    // Devolver la empresa encontrada
    return ApiResponse.success(res, empresa, 'Empresa encontrada.');
  } catch (error) {
    console.error('Error en la obtener la empresa:', error);
    return ApiResponse.error(res, error, 'Error en la obtencion de la empresa.');
  }
};
