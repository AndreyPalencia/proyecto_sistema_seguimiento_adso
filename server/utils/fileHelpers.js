import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Establecer la ruta base
export const BASE_UPLOAD_PATH = path.join(__dirname, '..', 'upload');

/**
 * Elimina un archivo si existe, en el caso de ocurra un error el siguiente middleware.
 * @param {string} filePath - Ruta del archivo a eliminar.
 * @returns {Promise<void>} Promesa que se resuelve cuando se elimina el archivo.
 */
export const rollbackFileOnError = async (filePath) => {
  if (!filePath) return;

  try {
    await fs.promises.unlink(filePath);
    console.log('Archivo eliminado:', filePath);
  } catch (error) {
    console.error('Error al eliminar el archivo:', error);
  }
};

/**
 *
 * @param {number} id - Id que lo relaciona a una tabla o registro.
 * @param {string} format - Indica el formato del archivo.
 * @param {string} prefix - Agrega un prefijo al archivo.
 * @param {string} sufix - Agregar un sufijo al final archivo (opcional).
 * @return {string} Retorna el nombre formateado del archivo.
 */
export const generateFileNameWithExtension = (
  id,
  format,
  prefix = 'documento',
  sufix = ''
) => {
  if (!id) throw new Error('Id es requerido');
  if (!format) throw new Error('Formato es requerido');

  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:]/g, '')
    .split('.')[0];
  const cleanFormat = format.startsWith('.') ? format.slice(1) : format;

  //Creacion de nombre del archivo
  let fileName = `${prefix}_${id}_${timestamp}`;
  if (sufix) fileName += `_${sufix}`;

  return `${fileName}.${cleanFormat}`;
};

/**
 * Elimina un archivo de manera segura usando Promises.
 * @param {string} filePath - Ruta del archivo a eliminar.
 * @returns {Promise<boolean>} - Retorna `true` si se eliminó correctamente, o lanza un error si falla.
 */
export const deleteFileSafely = async (filePath) => {
  try {
    //fs.promises.access verifica si el archivo existe
    //y el uso de constants.F_OK es el modo de acceso para verificar si el archivo existe
    await fs.promises.access(filePath, fs.constants.F_OK);
    await fs.promises.unlink(filePath);
    console.log(`Archivo eliminado con éxito: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error eliminando el archivo: ${filePath}`, error);
    throw new Error('Error al eliminar el archivo del sistema.');
  }
};

/**
 * Elimina el archivo antiguo durante una actualización.
 * Nota: No maneja la creación del nuevo archivo, solo la eliminación del antiguo.
 * @param {string} oldFilePath - Ruta del archivo antiguo a eliminar.
 * @param {string} newFilePath - Ruta del archivo nuevo (para comparación).
 */
export const updateFile = async (oldFilePath, newFilePath) => {
  if (!oldFilePath || !newFilePath) {
    throw new Error('Las rutas de archivo son requeridas.');
  }

  // Si son la misma ruta, no hacer nada
  if (oldFilePath === newFilePath) {
    return;
  }

  try {
    // Verificar si existe el archivo antiguo (versión más simple)
    if (fs.existsSync(oldFilePath)) {
      await fs.promises.unlink(oldFilePath);
      console.log(`Archivo antiguo eliminado: ${oldFilePath}`);
    } else {
      console.log(`El archivo antiguo no existe: ${oldFilePath}`);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error al eliminar el archivo antiguo:', error);
    }
    throw new Error('Error al eliminar el archivo antiguo.');
  }
};

/**
 * Devuelve la ruta de la firma según el nombre del archivo.
 * @param {string} firma - Nombre del archivo de la firma.
 * @returns {string} - Retorna la ruta de la firma or undefined.
 */
export const getFirmaPath = (firma) => {
  if (firma) {
    const firmaPath = path.join(BASE_UPLOAD_PATH, 'firmas', firma);
    return fs.existsSync(firmaPath) ? firmaPath : undefined;
  }
  return undefined;
};


/**
 * Devuleve la ruta de un archivo apartir del nombre de la carpeta y el archivo.
 * @param {string} folderName 
 * @param {string} fileName 
 * @returns Ruta del archivo si existe.
 */
export const getFileByName = async (folderName, fileName) => {
  if (!folderName || !fileName) {
    throw new Error('El nombre de la carpeta y el archivo son requeridos.');
  }
  const filePath = path.join(BASE_UPLOAD_PATH, folderName , fileName);
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return filePath;
  } catch (error) {
    console.error('Error al obtener el archivo:', error);
    throw new Error('Error al obtener el archivo.');
  }
}