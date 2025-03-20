import models from '../../models/index.js';
const { Usuario } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Visualizar un usuario por ID
export const getUsuarioById = async (req, res) => {
  const { idUsuario } = req.params;

  try {
    // Consultar el usuario con ambos parámetros
    const usuario = await Usuario.findByPk(idUsuario);

    // Verificar si el usuario existe
    if (!usuario) {
      return ApiResponse.notFound(res, 'Usuario no encontrado.');
    }

    // Devolver el usuario encontrado
    return ApiResponse.success(res, usuario, 'Usuario encontrado.');
  } catch (error) {
    console.error('Error en la obtener el usuario:', error);
    return ApiResponse.error(res, error, 'Error en la obtener el usuario.');
  }
};
