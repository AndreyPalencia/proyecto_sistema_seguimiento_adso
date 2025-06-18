import express from 'express';

import { createUploadMiddleware } from '../../config/multerConfig.js';
import { validateParamsIds } from '../../middlewares/validateParamsIds.js';
import verifyToken from '../../middlewares/verifyToken.js';

//Imporatar controladores de documentos
import { createDocumento } from '../../controllers/documentos/createDocumento.js';
import { getDocumentosByIdFichaAprendiz } from '../../controllers/documentos/getDocumentosByIdFichaAprendiz.js';
import { updateDocumento } from '../../controllers/documentos/updateDocumento.js';
import { updateDocumentoState } from '../../controllers/documentos/updateDocumentoState.js';
import { deleteDocumento } from '../../controllers/documentos/deleteDocumento.js';
import { downloadDocumento } from '../../controllers/documentos/downloadDocumento.js';

/* Rutas Documentos */

const routerDocumentos = express.Router();

// Configuración para subida obligatoria (allowEmpty: false)
const uploadRequired = createUploadMiddleware('documentos', {
  allowedExtensions: [
    '.pdf',
    '.xlsx',
    '.docx',
    '.doc',
    '.png',
    '.jpg',
    '.jpeg',
  ],
  maxFileSize: 10 * 1024 * 1024,
  allowEmpty: false, // Requiere archivo obligatorio
});

// Configuración para permitir actualización sin archivo (allowEmpty: true)
const uploadOptional = createUploadMiddleware('documentos', {
  allowedExtensions: [
    '.pdf',
    '.xlsx',
    '.docx',
    '.doc',
    '.png',
    '.jpg',
    '.jpeg',
  ],
  maxFileSize: 10 * 1024 * 1024,
  allowEmpty: true, // Permite no subir archivo
});

//Crear un documento
routerDocumentos.post(
  '/',
  verifyToken(['admin', 'aprendiz']),
  uploadRequired,
  createDocumento
);

//Obtener todos los documentos relacionados con id FichaAprendiz
routerDocumentos.get(
  '/ficha-aprendiz/:idFichaAprendiz',
  verifyToken(['*']),
  validateParamsIds,
  getDocumentosByIdFichaAprendiz
);

//Descarga un documento por [ID]
routerDocumentos.get(
  '/descargar/:fileName',
  verifyToken(['*']),
  downloadDocumento
);

//Modificar un documento por [ID]
routerDocumentos.put(
  '/:idDocumento',
  verifyToken(['*']),
  validateParamsIds,
  uploadOptional,
  updateDocumento
);

//Modificar el estado de un documento por [ID]
routerDocumentos.patch(
  '/:idDocumento/estado',
  verifyToken(['admin', 'instructor']),
  validateParamsIds,
  updateDocumentoState
);

//Eliminar un documento por [ID]
routerDocumentos.delete(
  '/:idDocumento',
  verifyToken(['admin']),
  validateParamsIds,
  deleteDocumento
);

export default routerDocumentos;
