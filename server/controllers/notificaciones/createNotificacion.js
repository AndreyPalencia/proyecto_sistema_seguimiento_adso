import models from '../../models/index.js';
const { Notificacion } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { io, usuariosConectados } from '../../index.js';

export const createNotificacion = async (req, res) => {
  try {
    const createNotificacion = await Notificacion.create(req.body);

    const { idUsuario } = createNotificacion.dataValues;
    const idUsuarioDestino = parseInt(idUsuario);

    console.log(idUsuarioDestino, typeof idUsuarioDestino);

    const socketIdDestino = usuariosConectados.get(idUsuarioDestino);

    console.log(idUsuarioDestino, socketIdDestino, usuariosConectados);

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
