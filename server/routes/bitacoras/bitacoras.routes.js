import express from 'express';
import { createUploadMiddleware } from '../../config/multerConfig.js';

//Importar controladores de bitacoras
import { createBitacora } from '../../controllers/bitacoras/createBitacora.js';
import { getBitacoraById } from '../../controllers/bitacoras/getBitacoraById.js';
import { getBitacorasByIdFichaAprendiz } from '../../controllers/bitacoras/getBitacorasByIdFichaAprendiz.js';
import { updateBitacora } from '../../controllers/bitacoras/updateBitacora.js';
import { updateBitacoraState } from '../../controllers/bitacoras/updateBitacoraState.js';
import { deleteBitacora } from '../../controllers/bitacoras/deleteBitacora.js';

/* Rutas Bitacoras */

const routerBitcoras = express.Router();

//Crear bitacora
routerBitcoras.post('/', createUploadMiddleware('bitacoras'), createBitacora);

//Obtener todas la bitacoras por el idFichaAprendiz
routerBitcoras.get(
  '/ficha-aprendiz/:idFichaAprendiz',
  getBitacorasByIdFichaAprendiz
);

//Obtener una bitacora por [ID]
routerBitcoras.get('/:idBitacora', getBitacoraById);

//Actualizar una bitacora por [ID]
routerBitcoras.put(
  '/:idBitacora',
  createUploadMiddleware('bitacoras', true),
  updateBitacora
);

//Actulizar el estado de bitacora por [ID]
routerBitcoras.patch('/:idBitacora', updateBitacoraState);

//Eliminar bitacoras por [ID]
routerBitcoras.delete('/:idBitacora', deleteBitacora);

export default routerBitcoras;
