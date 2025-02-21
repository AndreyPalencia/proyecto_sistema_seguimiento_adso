import models from '../../models/index.js';
const { Empresa } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Crear una empresa

export const createEmpresa = async (req, res) => {
  try {
    const empresa = await Empresa.create(req.body);

    return ApiResponse.created(res, empresa, 'Empresa creada correctamente');
  } catch (error) {
    console.error('Error en crear la empresa', error);
    return ApiResponse.error(res, error, 'Error en crear la empresa ');
  }
};
