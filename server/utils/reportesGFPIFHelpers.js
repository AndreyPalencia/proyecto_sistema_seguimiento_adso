import fs from 'fs';
import path from 'path';

import {
  BASE_UPLOAD_PATH,
  generateFileNameWithExtension,
} from './fileHelpers.js';

/**
 * Genera la ruta del archivo JSON para el reporte
 * @param {number} numeroFicha - Número de la ficha del aprendiz.
 * @param {number} idAprendiz - Id del aprendiz.
 * @return {object} { rutaReporteJSON, nombreReporteJSON } - Retorna el la ruta de reporte, como su nombre.
 */
export const generarRutaReporteJSON = (idAprendiz, numeroFicha) => {
  if (!numeroFicha) throw new Error('IdFicha es requerido');
  if (!idAprendiz) throw new Error('idAprendiz es requerido');

  const nombreReporteJSON = generateFileNameWithExtension(
    idAprendiz,
    'json',
    'reporte_aprendiz'
  );

  //Definir la carpeta donde se guardará el reporte
  const carpetaFicha = path.join(
    BASE_UPLOAD_PATH,
    'fichas',
    `ficha_${numeroFicha}`
  );

  //Valida la existencia de la carpetaFicha
  if (!fs.existsSync(carpetaFicha)) {
    fs.mkdirSync(carpetaFicha, { recursive: true });
  }

  console.log(nombreReporteJSON);
  return {
    ubicacionReporte: path.join(carpetaFicha, nombreReporteJSON),
    nombreReporte: nombreReporteJSON,
  };
};

/**
 * Genera el archvio JSON en la carpeta uplaod.
 * @param {string} rutaReporteJSON - Ruta completa (incluyendo nombre de archivo) donde se guardará el reporte.
 * @param {Object} reporteJSON - Objeto con los datos del reporte a guardar.
 * @returns No retorna ningún valor. La función guarda el reporte en el sistema de archivos.
 */
export const guardarReporteArchivoJSON = (rutaReporteJSON, reporteJSON) => {
  try {
    const reporteJSONString = JSON.stringify(reporteJSON, null, 2);
    fs.writeFileSync(rutaReporteJSON, reporteJSONString, 'utf-8');
  } catch (error) {
    console.error('Error al guardar el archivo JSON:', error);
    throw new Error(`No se pudo guardar el archivo JSON: ${error.message}`);
  }
};

/**
 * Obtener la ruta del archivo JSON guardo en upload.
 * @param {number} numeroFicha - Número de ficha del aprendiz.
 * @param {string} nombreReporte  - Nombre del reporte que esta en base de datos.
 * @returns {rutaArchivo} - Retrona la ruta del archivo del reporte JSON.
 */
export const obtenerRutaArchivoReporteJSON = (numeroFicha, nombreReporte) => {
  const rutaArchivo = path.join(
    BASE_UPLOAD_PATH,
    'fichas',
    `ficha_${numeroFicha}`,
    nombreReporte
  );
  return rutaArchivo;
};

/**
 * Devuelve el archivo JSON en objto literial.
 * @param {string} rutaArchivoReporteJSON - Ruta del archivo del reporte.
 * @returns {Object} reporteJSON - Devuelve el contendio del ruta del archivo en Objeto.
 */
export const parsearArchivoReporteJSON = (rutaArchivoReporteJSON) => {
  try {
    if (!fs.existsSync(rutaArchivoReporteJSON)) {
      throw new Error('El archivo JSON no existe.');
    }

    const reporteArchivoJSON = fs.readFileSync(rutaArchivoReporteJSON, 'utf-8');

    if (!reporteArchivoJSON.trim()) {
      throw new Error('El archivo JSON está vacío.');
    }

    const reporteJSON = JSON.parse(reporteArchivoJSON);
    //console.log('JSON cargado correctamente:', reporteJSON);
    return reporteJSON;
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    throw new Error(`Error al leer el archivo JSON: ${error.message}`);
  }
};
