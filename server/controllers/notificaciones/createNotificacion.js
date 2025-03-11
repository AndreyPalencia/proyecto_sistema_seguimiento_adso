import models from '../../models/index.js';
const { Notificacion } = models;
import ApiResponse from '../../utils/apiResponse.js';

export const createNotificacion = async (req, res) => {
  try {
    const createNotificacion = await Notificacion.create(req.body);
    return ApiResponse.created(res, createNotificacion, 'Notificación creada.');
  } catch (error) {
    console.error('Error al crear la notificación:', error);
    return ApiResponse.error(res, error, 'Error al crear notificación.');
  }
};
