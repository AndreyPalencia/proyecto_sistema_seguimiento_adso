import { apiClient } from './Axios';

/**
 * Inicia sesión con las credenciales proporcionadas.
 *
 * @param {object} formData - Credenciales del usuario (rol, tipo de documento, numero de documento y contraseña).
 * @returns {Promise<object>} - Respuesta con los datos del usuario y el token.
 */
export const iniciarSesion = async (formData) => {
  console.log('Hola');

  const { data } = await apiClient.post(`/auth/login`, formData);
  return data;
};

/**
 * Cierra la sesión del usuario autenticado.
 *
 * @returns {Promise<object>} - Respuesta que confirma el cierre de sesión.
 */
export const cerrarSesion = async () => {
  const { data } = await apiClient.post(`/auth/logout`);
  return data;
};

/**
 * Solicita la recuperación de la contraseña del usuario.
 *
 * @param {object} formData - Correo electrónico del usuario para recuperar la contraseña.
 * @returns {Promise<object>} - Respuesta que confirma la solicitud de recuperación.
 */
export const recuperarPassword = async (formData) => {
  const { data } = await apiClient.post(
    '/auth/reset-password/request',
    formData
  );
  return data;
};

/**
 * Confirma el restablecimiento de la contraseña con el nuevo token.
 *
 * @param {object} formData - Token de recuperación y nueva contraseña.
 * @returns {Promise<object>} - Respuesta que confirma el cambio de contraseña.
 */
export const resetearPassword = async (formData) => {
  const { data } = await apiClient.post(
    '/auth/reset-password/confirm',
    formData
  );
  return data;
};

export const cambiarPassword = async (formaData) => {
  const { data } = await apiClient.patch('/auth/change-password', formaData);
  console.log(data);
  return data;
};

export const cambiarPasswordAdmin = async (formaData) => {
  const { data } = await apiClient.patch('/auth/change-password-admin', formaData);
  console.log(data);
  return data;
};

/**
 * Valida la sesión del usuario autenticado y retorna su información.
 *
 * @returns {Promise<object>} - Objeto con los datos del usuario autenticado, que incluye:
 *   - `id`: El ID del usuario.
 *   - `role`: El rol del usuario (por ejemplo, 'administrador', 'aprendiz' o 'instructor').
 */
export const userRol = async () => {
  const { data } = await apiClient.post('/auth/validated-user');
  return data.data;
};
