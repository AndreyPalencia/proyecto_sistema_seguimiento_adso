import express from 'express';
import { validateParamsIds } from '../../middlewares/validateParamsIds.js';

//Import middleware
import { createReporteGFPIF } from '../../controllers/reportesGFPIF/createReporteGFPIF.js';
import { getReportesGFPIFByAprendiz } from '../../controllers/reportesGFPIF/getReportesGFPIFByAprendiz.js';
import { updateReporteGFPIF } from '../../controllers/reportesGFPIF/updateReporteGFPIF.js';
import { deleteReporteGFPIF } from '../../controllers/reportesGFPIF/deleteReporteGFPIF.js';
import {generateAndDownloadGFPIFReportWord} from '../../controllers/reportesGFPIF/generateAndDownloadGFPIFReportWord.js';
/* Rutas Reportes */
const routerReporetesGFPIF = express.Router();

//Crear un reporte
routerReporetesGFPIF.post(
  '/ficha/:idFicha/ficha-aprendiz/:idFichaAprendiz/',
  validateParamsIds,
  createReporteGFPIF
);

//Genera el reporte
routerReporetesGFPIF.post(
  '/ficha/:idFicha/ficha-aprendiz/:idFichaAprendiz/reporte/:idReporte/',
  validateParamsIds,
  generateAndDownloadGFPIFReportWord
);

//Ver reportes GFPIF por idFichaAprendiz
routerReporetesGFPIF.get(
  '/ficha-aprendiz/:idFichaAprendiz/',
  validateParamsIds,
  getReportesGFPIFByAprendiz
);

//Modificar reporte GFPIF JSON por idReporte
routerReporetesGFPIF.put(
  '/reporte/:idReporte/',
  validateParamsIds,
  updateReporteGFPIF
);

//Elimicacion de reporte GFPIF JSON
routerReporetesGFPIF.delete(
  '/reporte/:idReporte/',
  validateParamsIds,
  deleteReporteGFPIF
);

export default routerReporetesGFPIF;
