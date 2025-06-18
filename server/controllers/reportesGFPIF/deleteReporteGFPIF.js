import models from '../../models/index.js';
const { ReporteGFPIF, FichaAprendiz, Ficha } = models;
import fs from 'fs';
import path from 'path';
import ApiResponse from '../../utils/apiResponse.js';

import { BASE_UPLOAD_PATH, deleteFileSafely } from '../../utils/fileHelpers.js';

export const deleteReporteGFPIF = async (req, res) => {
  const { idReporte } = req.params;

  try {
    console.log('Eliminando reporte GFPIF con id:', idReporte);
    const reporteGFPIF = await ReporteGFPIF.findOne({
      where: { idReporte },
      attributes: ['nombreReporte'],
      include: [
        {
          model: FichaAprendiz,
          as: 'FichaAprendiz', // Alias de la relación en Sequelize
          attributes: ['idFicha'],
          // include: [
          //   {
          //     model: Ficha,
          //     as: 'Ficha',
          //     attributes: ['numeroFicha'],
          //   },
          // ],
        },
      ],
    });
    //Verificar si el reporte existe
    if (!reporteGFPIF) {
      return ApiResponse.error(
        res,
        { idReporte: 'No existe en la base de datos.' },
        'Reporte no encontrado.'
      );
    }
    const idFicha = reporteGFPIF?.FichaAprendiz?.idFicha;
    const nombreReporte = reporteGFPIF?.nombreReporte;

    //Verificar que la ficha existe y obtener número de ficha
    if (!idFicha) {
      return ApiResponse.error(
        res,
        { idReporte },
        'No se pudo determinar la ficha del reporte.'
      );
    }

    //Construción de la ruta del archivo reporteGFIPF JSON a eliminar
    const rutaReporte = path.join(
      BASE_UPLOAD_PATH,
      'fichas',
      `ficha_${idFicha}`,
      `${nombreReporte}`
    );

    await ReporteGFPIF.destroy({ where: { idReporte } });

    // Verificar si el archivo existe antes de eliminarlo
    if (fs.existsSync(rutaReporte)) {
      console.log('Ruta del archivo a eliminar:', rutaReporte);
      deleteFileSafely(rutaReporte);
    } else {
      console.warn(
        'El archivo no existe, pero el reporte fue eliminado de la base de datos.'
      );
    }

    //Enviar respuesta exitosa
    return ApiResponse.success(
      res,
      { rutaReporte },
      'Reporte eliminado exitosamente.'
    );
  } catch (error) {
    console.error('Error en la eliminación del reporte:', error);
    return ApiResponse.error(
      res,
      error,
      'Error en la eliminacion del reporte.'
    );
  }
};
