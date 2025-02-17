import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import ApiResponse from '../utils/apiResponse.js';

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
// Obtener el directorio actual del archivo
const __dirname = path.dirname(__filename);

/**
 * Crea una configuración de almacenamiento dinámico para multer.
 * @param {string} folderName - Nombre de la carpeta donde se almacenarán los archivos.
 * @returns {multer.StorageEngine} Configuración de almacenamiento para multer.
 */
const createStorage = (folderName) => {
  const uploadPath = path.join(__dirname, '../upload', folderName);

  
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Solo crea la carpeta si no existe
      console.log('Carpeta Creada:', uploadPath);
    } else {
      console.log('Carpeta Existente:', folderName);
    }

  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath); // Carpeta donde se guardan los archivos
    },
    filename: function (req, file, cb) {
      const nameUniqueId = Date.now(); //Cantidad de caracteres
      const fileExtension = path.extname(file.originalname); //Obtener la extecion del archivo
      cb(null, `${nameUniqueId}${fileExtension}`); // Nombre del archivo
    },
  });
};

/**
 * Middleware para manejar la subida de archivos con promesas.
 * @param {string} folderName - Nombre de la carpeta de destino.
 * @param {boolean} allowEmpty - Permitir solicitudes sin archivos adjuntos.
 * @returns {function} Middleware de Express para manejar la carga de archivos.
 */
export const createUploadMiddleware = (folderName, allowEmpty = false) => {
  //Obtenermos la configuracion de multer
  const storage = createStorage(folderName);
  //Se le pasa la configuracion a multer
  const upload = multer({ storage: storage }).single('archivo');

  return async (req, res, next) => {
    try {
      //Se le pasan la req y res para que multer ejecute la subida del archivo
      await new Promise((resolve, reject) => {
        upload(req, res, (error) => {
          if (error) return reject(error);
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