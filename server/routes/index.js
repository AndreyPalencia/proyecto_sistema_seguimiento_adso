const express = require('express');

const usuariosRoutes = require('../routes/usuarios');
const authRoutes = require('../routes/authRoutes');
const fichaRoutes = require('../routes/fichas');
const bitacorasRoutes = require('../routes/bitacoras');

const router = express.Router();//Creacion de rutas


router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/ficha', fichaRoutes);
router.use('/bitacoras', bitacorasRoutes);

module.exports = router;