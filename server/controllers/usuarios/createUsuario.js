import models from '../../models/index.js';
const { Usuario } = models;
import ApiResponse from '../../utils/apiResponse.js';
import encryptionUtil from '../../utils/encryption.js';
import fileHelpers from '../../utils/fileHelpers.js';

//Crear un usuario
export const createUsuario = async (req, res) => {
  try {
    // Encriptar la contraseña antes de crear el usuario
    const passwordEncryptada = await encryptionUtil.hashPassword(
      req.body.password
    );
    req.body.password = passwordEncryptada;

    // Si se subió un archivo (firma), añadirlo al cuerpo de la solicitud
    if (req.file && req.file.filename) {
      req.body.firma = req.file.filename;
    }

    // Crear el usuario con la contraseña encriptada y la firma (si existe)
    const usuario = await Usuario.create(req.body);

    return ApiResponse.created(res, usuario, 'Usuario creado exitosamente');
  } catch (error) {
    console.error('Error en crear el usuario', error);
    await fileHelpers.rollbackFileOnError(req.filePath);
    return ApiResponse.error(res, error, 'Error en crear el usuario');
  }
};
