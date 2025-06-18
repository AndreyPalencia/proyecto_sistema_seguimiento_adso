import { apiClient } from './Axios';

export const crearAprendizFicha = async (formData) => {
  const { data } = await apiClient.post('/ficha-aprendiz/', formData);
  return data;
};

/**
 * Obtiene los aprendices asociados a una ficha específica.
 *
 * @param {number|string} idFicha - ID de la ficha de formación.
 * @returns {Promise<Array>} - Devuelve un arreglo con los aprendices vinculados a la ficha.
 */
export const getAprendizByFichas = async (idFicha) => {
  const { data } = await apiClient.get(`/ficha-aprendiz/ficha/${idFicha}`);
  return data;
};

export const getAprendizByIdFichaAprendiz = async (idFicha, idAprendiz) => {
  const { data } = await apiClient.get(
    `/ficha-aprendiz/ficha/${idFicha}/usuario/${idAprendiz}`
  );
  return data.data;
};

export const getInfoAprendizByFichaAndAprendiz = async (idFichaAprendiz) => {
  const { data } = await apiClient.get(
    `/ficha-aprendiz/${idFichaAprendiz}/info`
  );
  return data.data;
};

export const getAprendicesByEmpresa = async (idEmpresa, idInstructor) => {
  const { data } = await apiClient.get(
    `/ficha-aprendiz/empresa/${idEmpresa}/instructor/${idInstructor}`
  );
  return data.data;
};

/**
 * Modifica la relacion de FichaAprendiz asociado a un aprendiz.
 *
 * @param {number|string} idFichaAprendiz - ID de fichaAprendiz.
 * @returns {Promise<Object>} - Devuelve un objeto con los datos modificados de la relación FichaAprendiz.
 */
export const modificarFichaAprendiz = async (
  idFichaAprendiz,
  formFichaAprendiz
) => {
  const { data } = await apiClient.put(
    `/ficha-aprendiz/${idFichaAprendiz}`,
    formFichaAprendiz
  );
  return data.data;
};
