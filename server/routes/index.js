import express from 'express';

// Importar todas las rutas
import routerUsuarios from './usuarios/usuarios.routes.js';
import routerFichas from './fichas/fichas.routes.js';
import routerAgendamientos from './agendamientos/agendameintos.routes.js';
import routerBitcoras from './bitacoras/bitacoras.routes.js';
import routerEmpresas from './empresas/empresas.routes.js';

//Creacion de rutas
const routes = express.Router();

// router.use('/auth', authRoutes);
routes.use('/usuarios', routerUsuarios);
routes.use('/fichas', routerFichas);
routes.use('/agendamientos', routerAgendamientos);
routes.use('/bitacoras', routerBitcoras);
routes.use('/empresas', routerEmpresas)

export default routes;
