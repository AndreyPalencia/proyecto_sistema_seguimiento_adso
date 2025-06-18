import models from '../../models/index.js';
import { sendWelcomeEmailToSAEP } from '../../services/mailerService.js';
const { Usuario } = models;
import ApiResponse from '../../utils/apiResponse.js';
import encryptionUtil, {
  generateSecurePassword,
} from '../../utils/encryptionUtil.js';
import { deleteFileSafely } from '../../utils/fileHelpers.js';

//Crear un usuario
export const createUsuario = async (req, res) => {
  try {
    //console.log('Middleware ejecutado - req.file:', req.file);

    // 1. Usar la contraseña si viene en el body, o generar una
    let password = req.body.password || generateSecurePassword();
    //console.log('Contraseña recibida o generada:', password);

    // 2. Encriptar la contraseña
    const passwordEncriptada = await encryptionUtil.hashPassword(password);
    req.body.password = passwordEncriptada;

    // 3. Adjuntar archivo si fue cargado
    if (req.file?.filename) {
      req.body.firma = req.file.filename;
    }

    // Normalizar el correo
    if (req.body.correoElectronico) {
      req.body.correoElectronico = req.body.correoElectronico.toLowerCase();
    }

    // 4. Crear el usuario
    const usuario = await Usuario.create(req.body);

    await sendWelcomeEmailToSAEP(usuario, password);

    return ApiResponse.created(res, usuario, 'Usuario creado exitosamente.');
  } catch (error) {
    console.error('Error en crear el usuario:', error);
    if (req.file?.filename) {
      deleteFileSafely(req.filePath);
    }
    return ApiResponse.error(res, error, 'Error en crear el usuario.');
  }
};
