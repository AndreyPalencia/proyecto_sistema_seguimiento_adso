// Importa el cliente de API configurado con Axios
import { apiClient } from './Axios';

/**
 *
 * @param {*} formData
 * @returns
 */
export const crearFicha = async (formData) => {
  const { data } = await apiClient.post('/fichas', formData);
  return data.data;
};

/**
 * Obtiene la información de una ficha específica.
 *
 * @param {string} idFicha - El ID de la ficha que se desea obtener.
 * @returns {Promise<Object>} Un objeto con los datos de la ficha solicitada.
 */
export const obtenerFichaById = async (idFicha) => {
  const { data } = await apiClient.get(`/fichas/${idFicha}`);
  return data.data;
};

/**
 * Modifica una ficha existente con los datos actualizados.
 *
 * @param {string} idFicha - El ID de la ficha que se desea modificar.
 * @param {Object} datosActualizados - Un objeto con los datos que se actualizarán en la ficha.
 * @returns {Promise<Object>} El objeto con los datos de la ficha actualizada.
 */
export const modificarFicha = async (idFicha, datosActualizados) => {
  const { data } = await apiClient.put(`/fichas/${idFicha}`, datosActualizados);
  return data.data;
};

/**
 */
export const modificarEstadoFicha = async (idFicha, estado) => {
  const { data } = await apiClient.patch(`/fichas/${idFicha}/estado`, estado);
  return data.data;
};

/**
 * Obtiene las fichas relacionadas con un instructor y su estado.
 *
 * @param {string} idInstructor - El ID del instructor cuyas fichas se desean obtener.
 * @param {string} estadoFicha - El estado de la ficha que se desea filtrar (por ejemplo, ["activo", 1],[ "archvida", 0] ).
 * @returns {Promise<Object[]>} Un array de objetos con las fichas que cumplen con los filtros dados.
 */
export const getFichasByIdInstructorAndState = async (
  idInstructor,
  estadoFicha
) => {
  const { data } = await apiClient.post(`/fichas/instructor/${idInstructor}`, {
    estadoFicha,
  });
  return data.data;
};

export const getFichasByIdAprendizAndState = async (
  idAprendiz,
  estadoFicha
) => {
  const { data } = await apiClient.post(`/fichas/aprendiz/${idAprendiz}`, {
    estadoFicha,
  });

  console.log(data, 'fichas');
  return data.data;
};



