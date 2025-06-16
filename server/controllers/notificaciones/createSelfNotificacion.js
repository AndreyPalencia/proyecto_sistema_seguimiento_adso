import models from '../../models/index.js';
const { Notificacion } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { io, usuariosConectados } from '../../index.js';

export const createSelfNotificacion = async (req, res) => {
  try {
    const createNotificacion = await Notificacion.create(req.body);

    const idUsuarioDestino = req.user.idUsuario;
    const socketIdDestino = usuariosConectados.get(idUsuarioDestino);

    if (socketIdDestino) {
      io.to(socketIdDestino).emit('notification', {
        message: 'Nueva notificación creada',
        data: createNotificacion,
      });
    }

    return ApiResponse.created(res, createNotificacion, 'Notificación creada.');
  } catch (error) {
    console.error('Error al crear la notificación:', error);
    return ApiResponse.error(res, error, 'Error al crear notificación.');
  }
};
