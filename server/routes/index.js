const express = require('express');

const usuariosRoutes = require('../routes/usuarios');
const authRoutes = require('../routes/authRoutes');

const router = express.Router();//Creacion de rutas


router.use('/auth', authRoutes);
router.use('/usuarios', usuariosRoutes);

module.exports = router;