import models from '../../models/index.js';
const { ReporteGFPIF } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const getReportesGFPIFByAprendiz = async (req, res) => {
  const {  idFichaAprendiz } = req.params;
  try {
    const reportesGFPIF = await ReporteGFPIF.findAll({
      where: { idFichaAprendiz },
    });
    if (reportesGFPIF.length === 0) {
      return ApiResponse.notFound(
        res,
        'No se encontraron reportes GFPIF para el aprendiz.'
      );
    }
    return ApiResponse.success(res, reportesGFPIF, 'Reportes encontrados.' );
  } catch (error) {
    console.log('Error en obtener los reportes por idFichaAprendiz:', error);
    return ApiResponse.error(res, error);
  }
};
