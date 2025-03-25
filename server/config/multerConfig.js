import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ApiResponse from '../utils/apiResponse.js';
import { generateFileNameWithExtension } from '../utils/fileHelpers.js';

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
// Obtener el directorio actual del archivo
const __dirname = path.dirname(__filename);

// Configuraciones por defecto globales
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const DEFAULT_ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.pdf', '.xlsx'];

/**
 * Maneja los errores específicos de Multer
 * @param {Error} error - Error de Multer
 * @param {number} maxFileSize - Tamaño máximo de archivo permitido
 * @returns {Error} Error procesado
 */
const handleMulterError = (error, maxFileSize) => {
  const errorMessages = {
    LIMIT_FILE_SIZE: `El archivo excede el tamaño máximo de ${
      maxFileSize / (1024 * 1024)
    } MB`,
    LIMIT_PART_COUNT: 'Se excedió el número máximo de partes en la subida',
    LIMIT_FILE_COUNT: 'Se excedió el número máximo de archivos',
    LIMIT_UNEXPECTED_FILE: 'Tipo de archivo inesperado',
    LIMIT_FIELD_KEY: 'Clave de campo no válida',
    LIMIT_FIELD_VALUE: 'Valor de campo no válido',
    LIMIT_FIELD_COUNT: 'Número máximo de campos excedido',
  };

  // Si es un error de Multer, devuelve un mensaje personalizado
  if (error instanceof multer.MulterError) {
    return new Error(errorMessages[error.code] || error); //Error -> desconocido en la subida de archivos
  }

  // Si no es un error de Multer, devuelve el error original
  return error;
};

/**
 * Crea una configuración de almacenamiento dinámico para multer.
 * @param {string} folderName - Nombre de la carpeta donde se almacenarán los archivos.
 * @returns {multer.StorageEngine} Configuración de almacenamiento para multer.
 */
const createStorage = (folderName) => {
  const uploadPath = path.join(__dirname, '../upload', folderName);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`Carpeta creada: ${uploadPath}`);
  } else {
    console.log(`Carpeta ya existía: ${uploadPath}`);
  }

  //preservePath
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath); // Carpeta donde se guardan los archivos
    },
    filename: function (req, file, cb) {
      //const nameUniqueId = Date.now(); //Cantidad de caracteres
      //El currentUserId se agregar en el middleware de verificacion y se podra acceder a el
      //En la mayoria a parecera como un default por el momento hasta implementar el middleware
      //Remplazar default por anon de anonimo cuando se implemete el middleware de verificacion de token
      const idUser = req.currentUserId || 'default';
      const fileExtension = path.extname(file.originalname); //Obtener la extecion del archivo
      const folderPrefix = folderName.endsWith('s')
        ? folderName.slice(0, -1)
        : folderName;
      const nameUniqueId = generateFileNameWithExtension(
        idUser,
        fileExtension,
        folderPrefix
      );
      //console.log(fileExtension)
      //cb(null, `${nameUniqueId}${fileExtension}`); // Nombre del archivo
      cb(null, `${nameUniqueId}`); // Nombre del archivo
    },
  });
};

/**
 * Configura el filtro de archivos permitidos
 * @param {string[]} [customExtensions] - Extensiones personalizadas
 * @returns {Function} Función de filtrado de archivos para Multer
 */
const configureFileFilter = (customExtensions) => {
  const allowedExtensions = customExtensions || DEFAULT_ALLOWED_EXTENSIONS;

  return function (req, file, cb) {
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return cb(
        new Error(`Solo se permiten archivos: ${allowedExtensions.join(', ')}`),
        false
      );
    }

    cb(null, true);
  };
};

/**
 * Middleware para manejar la subida de archivos con promesas.
 * @param {string} folderName - Nombre de la carpeta de destino.
 * @param {Object} [options={}] - Opciones de configuración
 * @param {boolean} [options.allowEmpty=false] - Permitir solicitudes sin archivos adjuntos
 * @param {number} [options.maxFileSize] - Tamaño máximo de archivo
 * @param {string[]} [options.allowedExtensions] - Extensiones de archivo permitidas
 * @returns {function} Middleware de Express para manejar la carga de archivos.
 */
export const createUploadMiddleware = (folderName, options = {}) => {
  //Destruramos option en sus valores y declaro valores por default
  const {
    allowEmpty = false,
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    allowedExtensions,
  } = options;
  //Obtenermos la configuracion de multer
  const storage = createStorage(folderName);
  //Se le pasa la configuracion a multer
  const upload = multer({
    storage: storage,
    limits: {
      files: 1,
      fileSize: maxFileSize,
    },
    fileFilter: configureFileFilter(allowedExtensions),
  }).single('archivo');

  return async (req, res, next) => {
    try {
      //Se le pasan la req y res para que multer ejecute la subida del archivo
      await new Promise((resolve, reject) => {
        upload(req, res, (error) => {
          //if (error) return reject(error);
          if (error) return reject(handleMulterError(error, maxFileSize));
          resolve();
        });
      });
      //Si no se sube ningun archivo y no se permite que sea vacio se retorna un error
      if (!req.file && !allowEmpty) {
        return ApiResponse.badRequest(res, 'No se ha subido ningun archivo.');
      }
      //Agregar la propiedad filePath al req
      req.filePath = req.file?.path;
      next();
    } catch (error) {
      return ApiResponse.error(res, error, 'Error al subir el archivo');
    }
  };
};
