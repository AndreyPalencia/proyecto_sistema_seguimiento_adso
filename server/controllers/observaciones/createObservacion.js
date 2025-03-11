import models from '../../models/index.js';
const { Observacion } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const createObservacion = async (req, res) => {
  try {
    const createObservacion = await Observacion.create(req.body);
    return ApiResponse.created(
      res,
      createObservacion,
      'Observación creada exitosamente.'
    );
  } catch (error) {
    console.error('Error al crear la observación:', error);
    return ApiResponse.error(res, error, 'Error al crear la observación.');
  }
};
