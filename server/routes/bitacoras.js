const express = require('express');
const router = express.Router(); //Crear rutas
const bitacorasController = require("../controllers/bitacorasController"); //Controlador de bitacora 
const upload = require('../config/multerConfig');

/* Rutas Bitacoras */
//Crear bitacora
router.post('/crearBitacora',upload.createUploadMiddleware('bitacora'),bitacorasController.crearBitacora); 
//Obtener todas la bitacoras por el idFichaAprendiz
router.post("/listarBitacoras/:idFichaAprendiz", bitacorasController.listarBitacoras);
//Obtener una bitacora por [id]
router.get('/:idBitacora',bitacorasController.visualizarBitacora);
//Actualizar una bitacora por [id]
router.put('/:idBitacora',upload.createUploadMiddleware('bitacora'),bitacorasController.actualizarBitacora);
//Eliminar bitacoras por [id]
//router.delete('/eliminarbitacora/:idBitacora',bitacorasController.eliminarBitacora);

module.exports = router;