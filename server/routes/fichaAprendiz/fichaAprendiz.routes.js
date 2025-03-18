import express from 'express';
import { validateParamsIds } from '../../middlewares/validateParamsIds.js';

//Importar controladores de usuarios
import { createFichaAprendiz } from '../../controllers/fichaAprendiz/createFichaAprendiz.js';
import { getFichaAprendiz } from '../../controllers/fichaAprendiz/getFichaAprendiz.js';
import { updateFichaAprendiz } from '../../controllers/fichaAprendiz/updateFichaAprendiz.js';

/* Rutas Agendamientos */

const routerFichaAprendiz = express.Router();

//Crear una relación entre una ficha  y un aprendiz
routerFichaAprendiz.post('/', createFichaAprendiz);

//Obtener la relación entre una ficha  y un aprendiz  por [ID]
routerFichaAprendiz.get(
  '/:idFichaAprendiz',
  validateParamsIds,
  getFichaAprendiz
);

//Modificar la relación entre una ficha  y un aprendiz por [ID]
routerFichaAprendiz.put(
  '/:idFichaAprendiz',
  validateParamsIds,
  updateFichaAprendiz
);

export default routerFichaAprendiz;
