import models from '../../models/index.js';
const { Usuario } = models;
import ApiResponse from '../../utils/apiResponse.js';
import encryptionUtil from '../../utils/encryptionUtil.js';
import { deleteFileSafely, getFileByName } from '../../utils/fileHelpers.js';

//Modificar un usuario por ID
export const updateUsuarioById = async (req, res) => {
  const { idUsuario } = req.params;
  const nuevosDatos = req.body;

  try {
    // Buscar usuario
    const usuario = await Usuario.findByPk(idUsuario);

    // Verificar si el usuario existe
    if (!usuario) {
      return ApiResponse.notFound(res, 'Usuario no encontrado.');
    }

    const oldFileUsuario = usuario.firma
      ? await getFileByName('firmas', usuario.firma)
      : null;

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

    const [updateRow] = await Usuario.update(nuevosDatos, {
      where: {
        idUsuario,
      },
    });

    // Verificar si se actualizó algún registro
    if (updateRow === 0) {
      return ApiResponse.error(
        res,
        undefined,
        'La actualización no pudo completarse. Verifique los datos proporcionados.'
      );
    }

    // Si se subió una nueva firma, eliminar la anterior
    if (req.file?.filename && oldFileUsuario) {
      deleteFileSafely(oldFileUsuario);
    }

    // Obentenemos el usuarios actualizado
    const usuarioActualizado = await Usuario.findByPk(idUsuario);

    return ApiResponse.success(
      res,
      usuarioActualizado,
      'Usuario actualizado exitosamente.'
    );
  } catch (error) {
    console.error('Error en la actualización de los datos del usuario:', error);
    if (req.file && req.file.filename) {
      deleteFileSafely(req.filePath);
    }
    return ApiResponse.error(
      res,
      error,
      'Error en la actualizacion de los datos del usuario.'
    );
  }
};
