import models from '../../models/index.js';
const { ReporteGFPIF,FichaAprendiz, Ficha } = models;
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
    //Obtener el reporte GFPIF, Ficha y FichaAprendiz por idReporte
    const reporteGFPIF = await ReporteGFPIF.findOne({
      where: { idReporte },
      include: {
        model: FichaAprendiz,
        as: 'FichaAprendiz',
        attributes: ['idFicha'],
        include: {
          model: Ficha,
          as: 'Ficha',
          attributes: ['numeroFicha'],
        },
      },
    });

    if (!reporteGFPIF) {
      return ApiResponse.error(
        res,
        { idReporte },
        'No se encontró el reporte GFPIF.'
      );
    }

    //Obtener el número de ficha y el nombre del reporte
    const numeroFicha = reporteGFPIF.FichaAprendiz.Ficha.numeroFicha;
    //Obtener el nombre del reporte
    const nombreReporte = reporteGFPIF.nombreReporte;

    //Obtener el reporte JSON
    const rutaReporte = obtenerRutaArchivoReporteJSON(
      numeroFicha,
      nombreReporte
    );
    //Parsear el archivo JSON
    const reporteJSON = parsearArchivoReporteJSON(rutaReporte);

    const updateObject = (target, changes) => {
      for (const key in changes) {
        if (typeof changes[key] === 'object' && changes[key] !== null) {
          // Si la clave es un objeto, entrar recursivamente
          if (!target[key]) target[key] = {}; // Crear el objeto si no existe
          updateObject(target[key], changes[key]);
        } else {
          // Si la clave es un valor primitivo, actualizarlo
          target[key] = changes[key];
        }
      }
    };

    updateObject(reporteJSON, updateData);

    //Guardar el reporte JSON actualizado
    guardarReporteArchivoJSON(rutaReporte, reporteJSON);
    
    console.log('Archivo JSON actualizado correctamente.');
    return ApiResponse.success(
      res,
      undefined,
      'Reporte GFPIF actualizado correctamente.'
    );
  } catch (error) {
    console.log('Error en obtener los reportes por idReporte:', error);
    return ApiResponse.error(res, error, 'Error al actualizar el reporte GFPIF.');
  }
};
