import models from '../../models/index.js';
const { ReporteGFPIF, FichaAprendiz, Ficha } = models;
import ApiResponse from '../../utils/apiResponse.js';
import {
  parsearArchivoReporteJSON,
  obtenerRutaArchivoReporteJSON,
  guardarReporteArchivoJSON,
} from '../../utils/reportesGFPIFHelpers.js';

export const updateReporteGFPIF = async (req, res) => {
  const { idReporte } = req.params;
  const updateData = req.body;

  try {
    const reporteGFPIF = await ReporteGFPIF.findOne({
      where: { idReporte },
      include: {
        model: FichaAprendiz,
        as: 'FichaAprendiz',
        attributes: ['idFicha'],
      },
    });

    if (!reporteGFPIF) {
      return ApiResponse.error(
        res,
        { idReporte },
        'No se encontró el reporte GFPIF.'
      );
    }

    const idFicha = reporteGFPIF.FichaAprendiz.idFicha;
    const nombreReporte = reporteGFPIF.nombreReporte;

    // Obtener ruta y contenido del archivo JSON
    const rutaReporte = obtenerRutaArchivoReporteJSON(idFicha, nombreReporte);
    const reporteJSON = parsearArchivoReporteJSON(rutaReporte);

    // Separar los datos que pertenecen al JSON del resto de los campos
    const { datosReporteJSON, ...camposReporte } = updateData;

    // Actualizar archivo JSON si viene `datosReporteJSON`
    if (datosReporteJSON && typeof datosReporteJSON === 'object') {
      const updateObject = (target, changes) => {
        for (const key in changes) {
          const newValue = changes[key];
          const isObject = typeof newValue === 'object' && newValue !== null;
          const isArray = Array.isArray(newValue);

          if (isArray) {
            target[key] = [...newValue];
          } else if (isObject) {
            if (!target[key] || typeof target[key] !== 'object') {
              target[key] = {};
            }
            updateObject(target[key], newValue);
          } else {
            target[key] = newValue;
          }
        }
      };

      updateObject(reporteJSON, datosReporteJSON);
      guardarReporteArchivoJSON(rutaReporte, reporteJSON);
    }

    // Actualizar los campos no-JSON en la base de datos si existen
    if (Object.keys(camposReporte).length > 0) {
      await reporteGFPIF.update(camposReporte);
    }

    console.log('Reporte GFPIF actualizado correctamente.');
    return ApiResponse.success(
      res,
      undefined,
      'Reporte GFPIF actualizado correctamente.'
    );
  } catch (error) {
    console.error('Error al actualizar el reporte GFPIF:', error);
    return ApiResponse.error(
      res,
      error,
      'Error al actualizar el reporte GFPIF.'
    );
  }
};
