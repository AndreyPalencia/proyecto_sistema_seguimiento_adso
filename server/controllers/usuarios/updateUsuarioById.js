import models from '../../models/index.js';
const { Usuario } = models;
import ApiResponse from '../../utils/apiResponse.js';
import encryptionUtil from '../../utils/encryptionUtil.js';
import fileHelpers from '../../utils/fileHelpers.js';

//Modificar un usuario por ID
export const updateUsuarioById = async (req, res) => {
  const idUsuario = req.params.idUsuario;
  const nuevosDatos = req.body;

  // Validación de id_usuario
  if (!idUsuario) {
    return ApiResponse.badRequest(res, 'El id_usuario es requerido');
  }

  try {
    // Verificar si el usuario existe
    if (nuevosDatos.password) {
      const passwordEncryptada = await encryptionUtil.hashPassword(
        nuevosDatos.password
      );
      nuevosDatos.password = passwordEncryptada;
    }

    // Si se subió un archivo (firma), añadirlo al cuerpo de la solicitud
    if (req.file && req.file.filename) {
      nuevosDatos.firma = req.file.filename;
    }

    const updateRow = await Usuario.update(nuevosDatos, {
      where: {
        idUsuario,
      },
    });

    // Verificar si se actualizó algún registro
    if (updateRow[0] === 0) {
      return ApiResponse.notFound(res, 'Usuario no encontrado');
    }

    // Obentenemos el usuarios actualizado
    const usuarioActualizado = await Usuario.findByPk(idUsuario);

    return ApiResponse.success(
      res,
      usuarioActualizado,
      'Usuario actualizado exitosamente'
    );
  } catch (error) {
    console.error('Error en la actualización de los datos del usuario', error);
    await fileHelpers.rollbackFileOnError(req.filePath);
    return ApiResponse.error(
      res,
      error,
      'Error en la actualizacion de los datos del usuario'
    );
  }
};
