import models from '../../models/index.js';
const { Notificacion } = models;
import { io, usuariosConectados } from '../../index.js';

export const generarNotificacion = async (notificacionData) => {
  try {
    const nuevaNotificacion = await Notificacion.create(notificacionData);

    const { idUsuario } = nuevaNotificacion.dataValues;
    const idUsuarioDestino = parseInt(idUsuario);

    const socketIdDestino = usuariosConectados.get(idUsuarioDestino);

    if (socketIdDestino) {
      io.to(socketIdDestino).emit('notification', {
        message: 'Nueva notificación creada',
        data: nuevaNotificacion,
      });
    }

    return nuevaNotificacion; // Devuelve el objeto creado
  } catch (error) {
    console.error('Error creando la notificación:', error);
    throw error; // Lanza el error para que lo maneje quien llame la función
  }
};
