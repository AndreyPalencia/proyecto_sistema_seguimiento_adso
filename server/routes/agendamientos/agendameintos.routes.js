const express = require('express');
const router = express.Router();//Creacion de rutas


/* Rutas Agendamientos */

const agendamientosController = require('../controllers/agendamientosController'); // Ajusta el path si está en otra carpeta

// Crear un nuevo agendamiento
router.post('/', agendamientosController.crearAgendamiento); 
// Obtener todos los agendamientos
router.post('/visualizarAgendamientos', agendamientosController.obtenerAgendamientos); 
// Obtener un agendamiento por [ID]
router.get('/:idAgendamiento', agendamientosController.obtenerAgendamientoEspecifico); 
// Modificar un agendamiento por [ID]
router.put('/:idAgendamiento', agendamientosController.modificarAgendamiento); 
// Eliminar un agendamiento por [ID]
router.delete('/:idAgendamiento', agendamientosController.eliminarAgendamiento);
// Actualizar el estado de la visita de un agendamiento
router.patch('/:idAgendamiento/estado', agendamientosController.actualizarEstadoVisita); 

/*Notas: Visualizacion de agendamientos por filtro del metodo de ? */


module.exports = router;