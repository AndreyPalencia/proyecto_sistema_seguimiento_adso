const express = require('express');
const router = express.Router();//Creacion de rutas
const fichasControllers = require('../controllers/fichasControllers.js'); //Controlador de fichas

module.exports = () => {
    /* Rutass Fichas */
    //Crear un ficha
    router.post('/ficha', fichasControllers.nuevaFicha);
    //Obtener todas la fichas un ficha
    router.get('/fichas', fichasControllers.obtenerFichas);
    //Obtener una ficha por [id]
    router.get('/ficha/:idFicha', fichasControllers.obtenerFicha);
    //Actualizar una ficha por [id]
    router.put('/ficha/:idFicha', fichasControllers.actualizarFicha);
    //Eliminar una ficha por [id]
    router.delete('/ficha/:idFicha', fichasControllers.eliminarFicha);//Falta probarlo
    //Archivar una ficha por [id] //Falta probarlo
    router.patch('/ficha/:idFicha/archivada', fichasControllers.archivarFicha); 
    return router;
}