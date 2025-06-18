import express from 'express';

import { createUploadMiddleware } from '../../config/multerConfig.js';
import { validateParamsIds } from '../../middlewares/validateParamsIds.js';
import verifyToken from '../../middlewares/verifyToken.js';

//Importar controladores de bitacoras
import { createBitacora } from '../../controllers/bitacoras/createBitacora.js';
import { getBitacoraById } from '../../controllers/bitacoras/getBitacoraById.js';
import { getBitacorasByIdFichaAprendiz } from '../../controllers/bitacoras/getBitacorasByIdFichaAprendiz.js';
import { updateBitacora } from '../../controllers/bitacoras/updateBitacora.js';
import { updateBitacoraState } from '../../controllers/bitacoras/updateBitacoraState.js';
import { deleteBitacora } from '../../controllers/bitacoras/deleteBitacora.js';
import { downaloadBitacora } from '../../controllers/bitacoras/downloadBitacora.js';

/* Rutas Bitacoras */

const routerBitcoras = express.Router();

// Configuración para subida obligatoria (allowEmpty: false)
const uploadRequired = createUploadMiddleware('bitacoras', {
  allowedExtensions: ['.pdf', '.xlsx', '.docx', '.doc', '.png', '.jpg'],
  maxFileSize: 10 * 1024 * 1024,
  allowEmpty: false, // Requiere archivo obligatorio
});

// Configuración para permitir actualización sin archivo (allowEmpty: true)
const uploadOptional = createUploadMiddleware('bitacoras', {
  allowedExtensions: ['.pdf', '.xlsx', '.docx', '.doc', '.png', '.jpg'],
  maxFileSize: 10 * 1024 * 1024,
  allowEmpty: true, // Permite no subir archivo
});

//Crear bitacora
routerBitcoras.post(
  '/',
  verifyToken(['admin', 'aprendiz']),
  uploadRequired,
  createBitacora
);

//Obtener todas la bitacoras por el idFichaAprendiz
routerBitcoras.get(
  '/ficha-aprendiz/:idFichaAprendiz',
  verifyToken(['*']),
  validateParamsIds,
  getBitacorasByIdFichaAprendiz
);

//Obtener una bitacora por [ID]
routerBitcoras.get(
  '/:idBitacora',
  verifyToken(['*']),
  validateParamsIds,
  getBitacoraById
);

//Descargar una bitacora por [ID]
routerBitcoras.get(
  '/descargar/:fileName',
  verifyToken(['*']),
  downaloadBitacora
);

//Actualizar una bitacora por [ID]
routerBitcoras.put(
  '/:idBitacora',
  verifyToken(['*']),
  validateParamsIds,
  uploadOptional,
  updateBitacora
);

//Actulizar el estado de bitacora por [ID]
routerBitcoras.patch(
  '/:idBitacora/estado',
  verifyToken(['admin', 'instructor']),
  validateParamsIds,
  updateBitacoraState
);

//Eliminar bitacoras por [ID]
routerBitcoras.delete(
  '/:idBitacora',
  verifyToken(['admin']),
  validateParamsIds,
  deleteBitacora
);

export default routerBitcoras;
