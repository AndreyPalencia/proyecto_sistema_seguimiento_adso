import { apiClient } from './Axios';

export const crearNotificacion = async (formData) => {
  const response = await apiClient.post('/notificaciones', formData);
  return response;
};

export const crearNotificacionSelf = async (formData) => {
  const response = await apiClient.post('/notificaciones/self', formData);
  return response;
};

/**
 * Obtiene las notificaciones de un usuario según su estado.
 *
 * @param {number|string} idUsuario - ID del usuario del que se obtendrán las notificaciones.
 * @param {Array<string>} estados - Arreglo de estados por los cuales se filtrarán las notificaciones (ej. ['nueva', 'leída']).
 * @returns {Promise<Array>} - Devuelve un arreglo con las notificaciones filtradas.
 */
export const obtenerNotificacion = async (idUsuario, estados) => {
  const response = await apiClient.post(
    `/notificaciones/${idUsuario}/usuario`,
    { estados }
  );
  return response;
};

/**
 * Modifica el estado de una notificación específica.
 *
 * @param {number|string} idNotificacion - ID de la notificación a modificar.
 * @param {string} estado - Nuevo estado que se asignará a la notificación (ej. 'leída').
 * @returns {Promise<Object>} - Devuelve la notificación actualizada.
 */
export const modificarEstado = async (idNotificacion, estado) => {
  const { data } = await apiClient.patch(
    `/notificaciones/${idNotificacion}/estado`,
    {
      estado, // Se envía el estado dinámico recibido por parámetro
    }
  );
  return data.data;
};
