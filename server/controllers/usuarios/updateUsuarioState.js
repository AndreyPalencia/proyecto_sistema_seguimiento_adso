import models from '../../models/index.js';
const { Usuario } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Cambiar estado del usuario por ID
export const updateUsuarioState = async (req, res) => {
  const idUsuario = req.params.idUsuario;
  const { estadoUsuario } = req.body;

  // Validación del estado
  if (estadoUsuario == null) {
    return ApiResponse.validation(res, 'Estado del usuario es requerido.');
  }

  try {
    const [updateRow] = await Usuario.update({estadoUsuario}, {
      where: {
        idUsuario: idUsuario,
      },
    });

    if (updateRow === 0) {
      return ApiResponse.notFound(res, 'Usuario no encontrado o sin cambios.');
    }

    return ApiResponse.success(
      res,
      undefined,
      'Estado del usuario cambiado exitosamente.'
    );
  } catch (error) {
    console.error('Error en la actulizar el estado del usuario:', error);
    return ApiResponse.error(
      res,
      error,
      'Error en la actualización el estado del usuario.'
    );
  }
};
