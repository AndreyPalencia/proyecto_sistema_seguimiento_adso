import express from 'express';
import { createUploadMiddleware } from '../../config/multerConfig.js';
import { validateParamsIds } from '../../middleware/validateParamsIds.js';

//Imporatar controladores de documentos
import { createDocumento } from '../../controllers/documentos/createDocumento.js';
import { getDocumentosByIdFichaAprendiz } from '../../controllers/documentos/getDocumentosByIdFichaAprendiz.js';
import { updateDocumento } from '../../controllers/documentos/updateDocumento.js';
import { updateDocumentoState } from '../../controllers/documentos/updateDocumentoState.js';
import { deleteDocumento } from '../../controllers/documentos/deleteDocumento.js';

/* Rutas Documentos */

const routerDocumentos = express.Router();

//Crear un documento
routerDocumentos.post(
  '/',
  createUploadMiddleware('documentos'),
  createDocumento
);

//Obtener todos los documentos relacionados con id FichaAprendiz
routerDocumentos.get(
  '/ficha-aprendiz/:idFichaAprendiz',
  validateParamsIds,
  getDocumentosByIdFichaAprendiz
);

//Modificar un documento por [ID]
routerDocumentos.put(
  '/:idDocumento',
  validateParamsIds,
  createUploadMiddleware('documentos', true),
  updateDocumento
);

//Modificar el estado de un documento por [ID]
routerDocumentos.patch(
  '/:idDocumento/estado',
  validateParamsIds,
  updateDocumentoState
);

//Eliminar un documento por [ID]
routerDocumentos.delete('/:idDocumento', validateParamsIds, deleteDocumento);

export default routerDocumentos;
