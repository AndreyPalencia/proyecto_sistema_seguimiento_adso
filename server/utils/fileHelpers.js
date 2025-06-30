import fs from 'fs';
import path from 'path';
import { mkdir, copyFile, rm } from 'fs/promises';
import { fileURLToPath } from 'url';
import mime from 'mime-types';

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
    await fs.promises.access(filePath, fs.constants.F_OK);
    await fs.promises.unlink(filePath);
    console.log(`Archivo eliminado con éxito: ${filePath}`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // El archivo no existe, no es un error crítico
      console.warn(`Archivo no encontrado, se omite: ${filePath}`);
      return false;
    }

    // Otro tipo de error (permisos, etc.)
    console.error(`Error eliminando archivo: ${filePath}`, error);
    // No lanzamos la excepción para que la edición continúe
    return false;
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

  // Evitar path traversal
  if (
    fileName.includes('..') ||
    fileName.includes('/') ||
    fileName.includes('\\')
  ) {
    throw new Error('Nombre de archivo inválido.');
  }

  const filePath = path.join(BASE_UPLOAD_PATH, folderName, fileName);

  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return filePath;
  } catch (error) {
    console.error('Error al acceder al archivo:', error.message);
    return new Error('El archivo no existe en el servidor.');
  }
};

export const createFolderAprendiz = async (pathFicha, usuario) => {
  try {
    if (
      !usuario?.tipoDocumento ||
      !usuario?.numeroDocumento ||
      !usuario?.nombre ||
      !usuario?.apellido
    ) {
      throw new Error('Usuario data is incomplete');
    }

    const nombreFolder = `${usuario.tipoDocumento}_${usuario.numeroDocumento}_${usuario.nombre}_${usuario.apellido}`;
    const pathAprendiz = path.join(
      pathFicha,
      nombreFolder.toUpperCase().replace(/\s+/g, '_')
    );

    await mkdir(pathAprendiz, { recursive: true });

    return pathAprendiz; // opcional: para saber la ruta creada
  } catch (error) {
    console.error('Error creating folder for aprendiz:', error);
    throw error; // importante para propagar el error
  }
};

export const filesDocumentosBitacorasAprendices = async (
  folderAprendiz,
  Bitacoras,
  Documentos
) => {
  const errores = [];

  if (Bitacoras && Bitacoras.length > 0) {
    const resBitacoras = await moveFilesAprendices(
      folderAprendiz,
      'bitacoras',
      'bitacora',
      Bitacoras
    );
    if (!resBitacoras.success) errores.push(...resBitacoras.errores);
  }

  if (Documentos && Documentos.length > 0) {
    const resDocumentos = await moveFilesAprendices(
      folderAprendiz,
      'documentos',
      'nombreDocumento',
      Documentos
    );
    if (!resDocumentos.success) errores.push(...resDocumentos.errores);
  }

  if (errores.length > 0) {
    return {
      success: false,
      errores,
      message: 'Algunos errores ocurrieron al mover archivos.',
    };
  }

  return {
    success: true,
    errores: [],
    message: 'Todos los archivos se movieron correctamente.',
  };
};

const moveFilesAprendices = async (
  folderAprendiz,
  folderName,
  paramSearch,
  arrayFiles
) => {
  if (!folderAprendiz || !folderName || !paramSearch || !arrayFiles) {
    throw new Error(
      `Datos incompletos para crear la carpeta ${folderName ?? undefined}`
    );
  }
  const errores = [];

  const folderFiles = path.join(folderAprendiz, folderName.toUpperCase());
  await mkdir(folderFiles, { recursive: true });

  //Mover files
  for (const file of arrayFiles) {
    const fileName = file[paramSearch];
    if (!fileName) continue;

    const extension = path.extname(fileName); // .pdf, .docx, etc.
    //New name
    let newNameFile;

    if (folderName === 'bitacoras') {
      newNameFile = nameBitacora(file);
    }

    if (folderName === 'documentos') {
      newNameFile = nameDocumento(file);
    }

    if (!newNameFile.trim()) {
      // Si el nombre está vacío, usa el nombre original sin extensión
      newNameFile = path.basename(fileName, extension);
    }

    const origen = path.join(BASE_UPLOAD_PATH, folderName, fileName);
    const destino = path.join(folderFiles, `${newNameFile}${extension}`);

    try {
      await copyFile(origen, destino);
    } catch (err) {
      console.warn(`Fallo la copia del archivo: ${fileName}`, err);
      errores.push(
        `Fallo la copia del archivo ${fileName}: ${err.message || err}`
      );
    }
  }

  if (errores.length > 0) {
    return {
      success: false,
      errores,
      message: `Ocurrio errores al mover los archivos en la carpeta ${folderName}`,
    };
  }

  return {
    success: true,
    errores: [],
    message: `Todos los archivos se movienron satisfactoriamente a la carpeta${folderName}`,
  };
};

const nameDocumento = (Documento) => {
  const tipo = Documento?.tipoDocumento ?? 'undefinedName';
  const fecha = Documento?.fechaUltimaActualizacion
    ? Documento.fechaUltimaActualizacion
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '_')
    : 'undefinedName';

  return `Documento_${tipo}_${fecha}`.toUpperCase().replace(/\s+/g, '_');
};

const nameBitacora = (Bitacora) => {
  const numeroBitacora = Bitacora?.numeroBitacora ?? 'undefinedName';
  const fecha = Bitacora?.fechaUltimaActualizacion
    ? Bitacora.fechaUltimaActualizacion
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, '_')
    : 'undefinedName';

  return `Bitacora_${numeroBitacora}_${fecha}`
    .toUpperCase()
    .replace(/\s+/g, '_');
};

/**
 * Elimina una carpeta completa (y su contenido) dado un path.
 * @param {string} path - Ruta absoluta o relativa de la carpeta.
 */
export const eliminarCarpeta = async (path) => {
  try {
    await rm(path, { recursive: true, force: true });
    console.log(`✅ Carpeta eliminada: ${path}`);
  } catch (error) {
    console.error(`❌ Error al eliminar la carpeta: ${error.message}`);
    throw error;
  }
};

export const handleFileDownload = async (res, folderName, fileName) => {
  if (!folderName || !fileName) {
    throw new Error('El nombre de la carpeta y el archivo son requeridos.');
  }

  // Evitar path traversal
  if (
    fileName.includes('..') ||
    fileName.includes('/') ||
    fileName.includes('\\')
  ) {
    throw new Error('Nombre de archivo inválido.');
  }
  const filePath = path.join(BASE_UPLOAD_PATH, folderName, fileName);
  try {
    await fs.promises.access(fileName, fs.constants.F_OK);

    const mimeType = mime.lookup(fileName) || 'application/octet-stream';
  } catch (error) {}
};
