import express from 'express';
import { createUploadMiddleware } from '../config/multerConfig.js';

// Importar controladores de bitacoras
import { createBitacora } from '../controllers/bitacoras/createBitacora.js';
import { getBitacora } from '../controllers/bitacoras/getBitacora.js';
import { getBitacorasByIdFichaAprendiz } from '../controllers/bitacoras/getBitacorasByIdFichaAprendiz.js';
import { updateBitacora } from '../controllers/bitacoras/updateBitacora.js';
import { deleteBitacora } from '../controllers/bitacoras/deleteBitacora.js';

//Creacion de rutas
const routerBitacoras = express.Router();

/* Rutas Bitacoras */
//Crear bitacora
routerBitacoras.post(
  '/crearBitacora',
  createUploadMiddleware('bitacora'),
  createBitacora
);
//Obtener todas la bitacoras por el idFichaAprendiz
routerBitacoras.post(
  '/listarBitacoras/:idFichaAprendiz',
  getBitacorasByIdFichaAprendiz
);
//Obtener una bitacora por [id]
routerBitacoras.get('/:idBitacora', getBitacora);
//Actualizar una bitacora por [id]
routerBitacoras.put(
  '/:idBitacora',
  createUploadMiddleware('bitacora'),
  updateBitacora
);
//Eliminar bitacoras por [id]
routerBitacoras.delete('/:idBitacora', deleteBitacora);

export default routerBitacoras;
