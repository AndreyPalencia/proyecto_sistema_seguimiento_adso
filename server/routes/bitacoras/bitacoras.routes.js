import express from 'express';
import { createUploadMiddleware } from '../../config/multerConfig.js';
import { validateParamsIds } from '../../middlewares/validateParamsIds.js';

//Importar controladores de bitacoras
import { createBitacora } from '../../controllers/bitacoras/createBitacora.js';
import { getBitacoraById } from '../../controllers/bitacoras/getBitacoraById.js';
import { getBitacorasByIdFichaAprendiz } from '../../controllers/bitacoras/getBitacorasByIdFichaAprendiz.js';
import { updateBitacora } from '../../controllers/bitacoras/updateBitacora.js';
import { updateBitacoraState } from '../../controllers/bitacoras/updateBitacoraState.js';
import { deleteBitacora } from '../../controllers/bitacoras/deleteBitacora.js';

/* Rutas Bitacoras */

const routerBitcoras = express.Router();

// Configuración para subida obligatoria (allowEmpty: false)
const uploadRequired = createUploadMiddleware('bitacoras', {
  allowedExtensions: ['.pdf', '.xlsx', '.docx', '.doc'],
  maxFileSize: 10 * 1024 * 1024,
  allowEmpty: false, // Requiere archivo obligatorio
});

// Configuración para permitir actualización sin archivo (allowEmpty: true)
const uploadOptional = createUploadMiddleware('bitacoras', {
  allowedExtensions: ['.pdf', '.xlsx', '.docx', '.doc'],
  maxFileSize: 10 * 1024 * 1024,
  allowEmpty: true, // Permite no subir archivo
});

//Crear bitacora
routerBitcoras.post('/', uploadRequired, createBitacora);

//Obtener todas la bitacoras por el idFichaAprendiz
routerBitcoras.get(
  '/ficha-aprendiz/:idFichaAprendiz',
  validateParamsIds,
  getBitacorasByIdFichaAprendiz
);

//Obtener una bitacora por [ID]
routerBitcoras.get('/:idBitacora', validateParamsIds, getBitacoraById);

//Actualizar una bitacora por [ID]
routerBitcoras.put(
  '/:idBitacora',
  validateParamsIds,
  uploadOptional,
  updateBitacora
);

//Actulizar el estado de bitacora por [ID]
routerBitcoras.patch('/:idBitacora', validateParamsIds, updateBitacoraState);

//Eliminar bitacoras por [ID]
routerBitcoras.delete('/:idBitacora', validateParamsIds, deleteBitacora);

export default routerBitcoras;
