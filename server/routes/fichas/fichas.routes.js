import express from 'express';

// Importacion de rutas al modelo
import { createFicha } from '../../controllers/fichas/createFicha.js';
import { getFichaById } from '../../controllers/fichas/getFichaById.js';
import { updateFicha } from '../../controllers/fichas/updateFicha.js';
import { updateFichaState } from '../../controllers/fichas/updateFichaState.js';

// creacion de rutas
const routerFichas = express.Router();

/* Rutass Fichas */
//Crear un ficha
routerFichas.post('/', createFicha);

//Visualizar una ficha por ID
routerFichas.get('/:idFicha', getFichaById);

//Modificar una ficha por [ID]
routerFichas.put('/:idFicha', updateFicha);

// Modificar el estado de una ficha por [ID]
routerFichas.patch('/:idFicha/estado', updateFichaState);

export default routerFichas;
