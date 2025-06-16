import models from '../../models/index.js';
const { ReporteGFPIF, FichaAprendiz } = models;
import ApiResponse from '../../utils/apiResponse.js';
import {
  obtenerRutaArchivoReporteJSON,
  parsearArchivoReporteJSON,
} from '../../utils/reportesGFPIFHelpers.js';

export const getReporteGFPIFById = async (req, res) => {
  const { idReporte } = req.params;

  try {
    const reporte = await ReporteGFPIF.findByPk(idReporte, {
      include: {
        model: FichaAprendiz,
        as: 'FichaAprendiz',
        attributes: ['idFicha'],
      },
    });

    if (!reporte) {
      return ApiResponse.notFound(
        res,
        'No se encontró el reporte GFPIF con el id proporcionado.'
      );
    }

    const idFicha = reporte.FichaAprendiz.idFicha;
    const nombreReporte = reporte.nombreReporte;

    const ruta = obtenerRutaArchivoReporteJSON(idFicha, nombreReporte);
    const contenidoJSON = parsearArchivoReporteJSON(ruta); // Esto es un objeto JS

    const {
      tipoReporte,
      fechaUltimaActualizacion,
      idAprendiz,
      idInstructor,
      ...datosReporteJSON
    } = contenidoJSON;

    return ApiResponse.success(
      res,
      { ...reporte.toJSON(), datosReporteJSON },
      'Reporte GFPIF encontrado.'
    );
  } catch (error) {
    console.error('Error al obtener el reporte GFPIF por idReporte:', error);
    return ApiResponse.error(res, error, 'Error al buscar el reporte.');
  }
};
