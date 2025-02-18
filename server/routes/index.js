import express from 'express';

// Importar todas las rutas
import routerUsuarios from './usuarios/usuarios.routes.js';

// const authRoutes = require('../routes/authRoutes');
// const fichaRoutes = require('../routes/fichas');
// const agendamientoRoutes = require("../routes/agendameintos");
// const bitacorasRoutes = require('../routes/bitacoras');

//Creacion de rutas
const routes = express.Router();

// router.use('/auth', authRoutes);
routes.use('/usuarios', routerUsuarios);
// router.use('/ficha', fichaRoutes);
// router.use('/agendamientos', agendamientoRoutes);
// router.use('/bitacoras', bitacorasRoutes);

export default routes;