import express from 'express';
import verifyToken from '../../middlewares/verifyToken.js';

//Importar controladores de usuarios
import { downloadReporteFichaAprendices } from '../../controllers/archivosGenerados/reporteFicha/downloadReporteFichaAprendices.js';
import { downloadDocumentosFicha } from '../../controllers/archivosGenerados/downloadDocumentosFichas/downloadDocumentosFicha.js';
import { downloadReporteSinAgendamiento } from '../../controllers/archivosGenerados/reportesVisitas/downloadReporteSinAgendamientos.js';
import { downloadReporteAprendicesAgendamientosNoRelizados } from '../../controllers/archivosGenerados/reportesVisitas/downloadReparteAprendicesAgendamientoNoRealizado.js';
import { downloadReporteMaps } from '../../controllers/archivosGenerados/reporteMaps/downloadReporteMaps.js';
import { getFileFirma } from '../../controllers/archivosGenerados/downloadFiles/getFileFirma.js';

/* Rutas Reportes Generales */

const routerArchivosGenerados = express.Router();

//Generar reporte de aprendices por ficha
routerArchivosGenerados.post(
  '/reporte-ficha-aprendices',
  verifyToken(['admin', 'instructor']),
  downloadReporteFichaAprendices
);

//Generar reporte de aprendices sin agendamiento por instructor
routerArchivosGenerados.post(
  '/reporte-aprendices-sin-agendamiento-fichas/instructor/:idInstructor',
  verifyToken(['admin', 'instructor']),
  downloadReporteSinAgendamiento
);

//Generar reporte de aprendices con agendamientos pasados
routerArchivosGenerados.post(
  '/reporte-aprendices-agendamiento-no-realizados-fichas/instructor/:idInstructor',
  verifyToken(['admin', 'instructor']),
  downloadReporteAprendicesAgendamientosNoRelizados
);

//Generar reporte de ruta por aprendices por agendamientos
routerArchivosGenerados.post(
  '/ruta-aprendices-visitas/maps/instructor/:idInstructor',
  verifyToken(['admin', 'instructor']),
  downloadReporteMaps
);

//Generar el zip para descargar todo la información
//de los aprendices de un ficha por ficha [ID]
routerArchivosGenerados.get(
  '/descargar-zip-ficha/:idFicha',
  verifyToken(['admin', 'instructor']),
  downloadDocumentosFicha
);

routerArchivosGenerados.get(
  '/imagen/:nombre',
  verifyToken(['*']),
  getFileFirma
);
export default routerArchivosGenerados;
