import { apiClient } from './Axios';

export const buscarUsuario = async (filtros) => {
  const { data } = await apiClient.post('/usuarios/buscar', filtros);
  return data.data;
};
/**
 * Obtiene un usuario por su ID.
 *
 * @param {number|string} idUsuario - ID del usuario a obtener.
 * @returns {Promise<Object>} - Devuelve el usuario obtenido por el servidor.
 */
export const obtenerUsuario = async (idUsuario) => {
  const { data } = await apiClient.get(`/usuarios/${idUsuario}`);
  return data.data;
};

export const obtenerUsuarios = async () => {
  const { data } = await apiClient.get(`/usuarios`);
  return data.data;
};

/**
 * Crea un nuevo usuario.
 *
 * @param {Object} formData - Objeto con los datos del usuario a crear.
 * @returns {Promise<Object>} - Devuelve el usuario creado por el servidor.
 */
export const crearUsuario = async (formData) => {
  // console.log(formData, 'formData');
  // for (let [key, value] of formData.entries()) {
  //   console.log(key, value, 'datall');
  // }

  const response = await apiClient.post('/usuarios', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

/**
 * Modifica los datos de un usuario existente.
 *
 * @param {number|string} idUsuario - ID del usuario a modificar.
 * @param {Object} formData - Objeto con los datos actualizados del usuario.
 * @returns {Promise<Object>} - Devuelve el usuario modificado.
 */
export const modificarUsuario = async (idUsuario, formData) => {
  const { data } = await apiClient.put(`/usuarios/${idUsuario}`, formData);
  return data;
};
