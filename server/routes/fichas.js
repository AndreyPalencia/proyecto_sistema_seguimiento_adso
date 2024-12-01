const express = require('express');
const router = express.Router();//Creacion de rutas
const fichasControllers = require('../controllers/fichasControllers'); //Controlador de fichas


/* Rutass Fichas */
//Crear un ficha
router.post('/crearFicha', fichasControllers.nuevaFicha);
//Obtener todas la fichas un ficha
router.get('/visualizarFichas', fichasControllers.obtenerFichas);
//Obtener una ficha por [id]
router.get('/:idFicha', fichasControllers.obtenerFicha);
//Actualizar una ficha por [id]
router.put('/:idFicha', fichasControllers.actualizarFicha);
//Eliminar una ficha por [id]
router.delete('/:idFicha', fichasControllers.eliminarFicha);//Falta probarlo
//Archivar una ficha por [id] //Falta probarlo
router.patch('/:idFicha/estado', fichasControllers.archivarFicha);

module.exports = router;