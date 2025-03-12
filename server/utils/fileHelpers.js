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

