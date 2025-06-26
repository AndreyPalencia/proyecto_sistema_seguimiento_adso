import express from 'express';

//Importar todas las rutas
import routerUsuarios from './usuarios/usuarios.routes.js';
import routerFichas from './fichas/fichas.routes.js';
import routerAgendamientos from './agendamientos/agendameintos.routes.js';
import routerBitcoras from './bitacoras/bitacoras.routes.js';
import routerEmpresas from './empresas/empresas.routes.js';
import routerAuthentification from './authentication/authentication.routes.js';
import routerFichaAprendiz from './fichaAprendiz/fichaAprendiz.routes.js';
import routerDocumentos from './documentos/documentos.routes.js';
import routerObservaciones from './observaciones/observaciones.routes.js';
import routerNotificaciones from './notificiaciones/notificaciones.routes.js';
import routerReporetesGFPIF from './reportesGFPIF/reportesGFPIF.routes.js';
import routerArchivosGenerados from './archivosGenerados/archivosGenerados.js';

import verifyToken from '../middlewares/verifyToken.js';

//Creacion de rutas
const routes = express.Router();

routes.use('/auth', routerAuthentification);
routes.use('/usuarios', routerUsuarios);
routes.use('/fichas', routerFichas);
routes.use('/agendamientos', routerAgendamientos);
routes.use('/bitacoras', routerBitcoras);
routes.use('/empresas', routerEmpresas);
routes.use('/observaciones', routerObservaciones);
routes.use('/notificaciones', verifyToken(['*']), routerNotificaciones);
routes.use('/ficha-aprendiz', routerFichaAprendiz);
routes.use('/documentos', routerDocumentos);
routes.use(
  '/reportes-gfpif',
  verifyToken(['admin', 'instructor']),
  routerReporetesGFPIF
);
routes.use(
  '/archivos-generados',
  routerArchivosGenerados
);

export default routes;
