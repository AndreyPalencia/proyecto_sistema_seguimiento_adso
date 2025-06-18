import { apiClient } from './Axios';

/**
 * Obtener agendamientos según el rol del usuario.
 *
 *
 * @returns {Promise<Array>} - Devuelve un arreglo con los agendamientos obtenidos del servidor.
 */
export const getAgendamientoByRol = async (
  { idInstructor, idFichaAprendiz },
  idFicha
) => {
  const payload = {};

  if (idInstructor) payload.idInstructor = idInstructor;
  if (idFichaAprendiz) payload.idFichaAprendiz = idFichaAprendiz;
  if (idFicha) payload.idFicha = idFicha;

  const { data } = await apiClient.post('/agendamientos/rol', payload);
  return data.data;
};

/**
 * Crear un nuevo agendamiento.
 *
 * @param {Object} formData - Objeto con los datos del agendamiento a crear.
 * @returns {Promise<Object>} - Devuelve el agendamiento creado por el servidor.
 */
export const createAgendamiento = async (formData) => {
  const { data } = await apiClient.post('/agendamientos', formData);
  return data.data;
};

/**
 * Actualizar un agendamiento existente.
 *
 * @param {number|string} idAgendamiento - ID del agendamiento a actualizar.
 * @param {Object} formData - Objeto con los datos actualizados del agendamiento.
 * @returns {Promise<Object>} - Devuelve el agendamiento actualizado por el servidor.
 */
export const updateAgendamiento = async (idAgendamiento, formData) => {
  const { data } = await apiClient.put(
    `/agendamientos/${idAgendamiento}`,
    formData
  );
  return data.data;
};

/**
 * Eliminar un agendamiento por su ID.
 *
 * @param {number|string} idAgendamiento - ID del agendamiento a eliminar.
 * @returns {Promise<Object>} - Devuelve la respuesta del servidor tras la eliminación.
 */
export const deleteAgendamiento = async (idAgendamiento) => {
  const { data } = await apiClient.delete(`/agendamientos/${idAgendamiento}`);
  return data;
};
