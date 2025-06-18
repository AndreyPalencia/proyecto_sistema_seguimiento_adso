import { apiClient } from './Axios';

export const crearEmpresa = async (formData) => {
  const { data } = await apiClient.post(`/empresas/`, formData);
  return data.data;
};

/**
 * Obtiene la la información de la empresa realcionada al aprendiz, usando el ID empresa.
 *
 * @param {string|number} idEmpresa - ID de la empresa relacionado.
 *
 * @returns {Promise<Object>}
 */
export const obtenerEmpresa = async (idEmpresa) => {
  const { data } = await apiClient.get(`/empresas/${idEmpresa}`);
  return data.data;
};

/**
 * Modfica la información de la empresa realcionada usando el ID empresa.
 *
 * @param {string|number} idEmpresa - ID de la empresa relacionado.
 * @param {Object} formEmpresa - Objeto con los datos de la empresa a modificar.
 *
 * @returns {Promise<Object>}
 */
export const modificarEmpresa = async (idEmpresa, formEmpresa) => {
  const { data } = await apiClient.put(`/empresas/${idEmpresa}`, formEmpresa);
  return data.data;
};

/**
 * Realiza una solicitud al backend para buscar empresas según filtros específicos.
 *
 * @param {Object} filtros - Objeto con los criterios de búsqueda (ej: nit, razonSocial, etc.).
 *
 * @returns {Promise<Object>} - Retorna una promesa que resuelve con los datos encontrados (empresas).
 */
export const buscarEmpresas = async (filtros) => {
  const { data } = await apiClient.post(`/empresas/buscar`, filtros);
  return data.data;
};
