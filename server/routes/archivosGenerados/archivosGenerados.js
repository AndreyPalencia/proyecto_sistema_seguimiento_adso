import express from 'express';

//Importar controladores de usuarios
import { downloadReporteFichaAprendices } from '../../controllers/archivosGenerados/reporteFicha/downloadReporteFichaAprendices.js';
import { downloadDocumentosFicha } from '../../controllers/archivosGenerados/downloadDocumentosFichas/downloadDocumentosFicha.js';
import { downloadReporteSinAgendamiento } from '../../controllers/archivosGenerados/reportesVisitas/downloadReporteSinAgendamientos.js';
import { downloadReporteAprendicesAgendamientosNoRelizados } from '../../controllers/archivosGenerados/reportesVisitas/downloadReparteAprendicesAgendamientoNoRealizado.js';
import { downloadReporteMaps } from '../../controllers/archivosGenerados/reporteMaps/downloadReporteMaps.js';

/* Rutas Reportes Generales */

const routerArchivosGenerados = express.Router();

//Generar reporte de aprendices por ficha
routerArchivosGenerados.post(
  '/reporte-ficha-aprendices',
  downloadReporteFichaAprendices
);

//Generar reporte de aprendices sin agendamiento por instructor
routerArchivosGenerados.post(
  '/reporte-aprendices-sin-agendamiento-fichas/instructor/:idInstructor',
  downloadReporteSinAgendamiento
);

//Generar reporte de aprendices con agendamientos pasados
routerArchivosGenerados.post(
  '/reporte-aprendices-agendamiento-no-realizados-fichas/instructor/:idInstructor',
  downloadReporteAprendicesAgendamientosNoRelizados
);

//Generar reporte de ruta por aprendices por agendamientos
routerArchivosGenerados.post(
  '/ruta-aprendices-visitas/maps/instructor/:idInstructor',
  downloadReporteMaps
);

//Generar el zip para descargar todo la información
//de los aprendices de un ficha por ficha [ID]
routerArchivosGenerados.get(
  '/descargar-zip-ficha/:idFicha',
  downloadDocumentosFicha
);

export default routerArchivosGenerados;
