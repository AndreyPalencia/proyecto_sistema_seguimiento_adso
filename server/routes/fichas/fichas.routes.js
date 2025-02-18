import express from 'express';
import { crearFicha } from "../controllers/fichas/createFicha";
import { getFichas } from '../controllers/fichas/getFichas';


const router = express.Router();
const fichasControllers = require('../controllers/fichasControllers'); //Controlador de fichas
 

/* Rutass Fichas */
//Crear un ficha
router.post("/crearFicha", crearFicha);
//Obtener todas la fichas un ficha
router.get("/visualizarFichas", getFichas);
//Obtener una ficha por [ID]
router.get('/:idFicha', fichasControllers.obtenerFicha);
//Actualizar una ficha por [ID]
router.put('/:idFicha', fichasControllers.actualizarFicha);
//Eliminar una ficha por [ID]
router.delete('/:idFicha', fichasControllers.eliminarFicha);//Falta probarlo
//Archivar una ficha por [ID] //Falta probarlo
router.patch('/:idFicha/estado', fichasControllers.archivarFicha);

module.exports = router;