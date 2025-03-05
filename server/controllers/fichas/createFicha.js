import models from '../../models/index.js';
const { Ficha } = models;
import ApiResponse from '../../utils/apiResponse.js';

// Crear una ficha
export const createFicha = async (req, res) => {
  try {
    const createFicha = await Ficha.create(req.body);
    return ApiResponse.created(res, createFicha, 'Ficha creada con éxito.');
  } catch (error) {
    console.error('Error al ingresar datos de la ficha:', error);
    return ApiResponse.error(res, error, 'Error al crear la ficha.');
  }
};
