import fs from 'fs';


const fileHelpers = {
  /**
   * Elimina un archivo si existe, en el caso de ocurra un error el siguiente middleware.
   * @param {string} filePath - Ruta del archivo a eliminar.
   * @returns {Promise<void>} Promesa que se resuelve cuando se elimina el archivo.
   */
  rollbackFileOnError: async (filePath) => {
    if (!filePath) return;

    try {
      await fs.promises.unlink(filePath);
      console.log('Archivo eliminado:', filePath);
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
    }
  },
};


export default fileHelpers;