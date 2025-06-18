import { apiClient, apiFileClient } from './Axios';

export const crearBitacora = async (bitacoraCreada) => {
  const { data } = await apiClient.post('/bitacoras', bitacoraCreada);
  return data.data;
};

export const obtenerBitacorasByIdFichaAprendiz = async (idFichaAprendiz) => {
  const { data } = await apiClient.get(
    `/bitacoras/ficha-aprendiz/${idFichaAprendiz}`
  );
  return data.data;
};

export const modificarBitacora = async (idBitacora, formData) => {
  const { data } = await apiClient.put(`/bitacoras/${idBitacora}`, formData);
  return data.data;
};

export const eliminarBitacora = async (idBitacora) => {
  const { data } = await apiClient.delete(`/bitacoras/${idBitacora}`);
  return data;
};

export const descargarBitacora = async (fileName) => {
  try {
    // Cambiar apiClient por apiFileClient
    const response = await apiFileClient.get(
      `/bitacoras/descargar/${fileName}`,
      {
        responseType: 'blob', // Asegurarse de que la respuesta sea un blob
      }
    );

    // Crear el Blob con los datos de la respuesta
    const blob = new Blob([response.data], {
      type: response.headers['content-type'], // Usar el tipo de contenido de la respuesta
    });

    // Crear un enlace temporal para la descarga
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // Establecer el nombre del archivo descargado
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error al descargar la bitácora:', error);
    throw error; // Puedes decidir cómo manejar el error (mostrar mensaje, reintentar, etc.)
  }
};
