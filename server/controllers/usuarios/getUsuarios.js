import models from '../../models/index.js';
const { Usuario } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Visualizar un usuario por ID
export const getUsuarios = async (req, res) => {
  try {
    // Consultar el usuario con ambos parámetros
    const usuarios = await Usuario.findAll({
      attributes: {
        exclude: ['password', 'firma'],
      },
      order: [['rol','ASC'],['numeroDocumento', 'ASC'], ],
    });

    // Verificar si el usuario existe
    if (!usuarios) {
      return ApiResponse.notFound(res, 'Usuarios no encontrados.');
    }

    // Devolver el usuario encontrado
    return ApiResponse.success(res, usuarios, 'Usuarios encontrados.');
  } catch (error) {
    console.error('Error en la obtener el usuario:', error);
    return ApiResponse.error(
      res,
      error,
      'Error en la obtener todos los usuarios.'
    );
  }
};
