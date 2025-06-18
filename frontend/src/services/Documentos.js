import { apiClient, apiFileClient } from './Axios';

export const crearDocumento = async (documentoCreado) => {
  const { data } = await apiClient.post('/documentos', documentoCreado);
  return data.data;
};

export const obtenerDocumentosByIdFichaAprendiz = async (idFIchaAprendiz) => {
  const { data } = await apiClient.get(
    `/documentos/ficha-aprendiz/${idFIchaAprendiz}`
  );
  return data.data;
};

export const modificarDocumento = async (idDocumento, formData) => {
  console.log(idDocumento, formData);
  const { data } = await apiClient.put(`/documentos/${idDocumento}`, formData);
  return data.data;
};

export const eliminarDocumento = async (idDocumento) => {
  const { data } = await apiClient.delete(`/documentos/${idDocumento}`);
  return data.data;
};

export const descargarDocumento = async (fileName) => {
  try {
    // Cambiar apiClient por apiFileClient
    const response = await apiFileClient.get(
      `/documentos/descargar/${fileName}`,
      {
        responseType: 'blob', // Asegurarse de que la respuesta sea de tipo blob
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
    link.remove(); // Limpiar el DOM tras la descarga
  } catch (error) {
    console.error('Error al descargar el documento:', error);
    throw error; // Puedes decidir cómo manejar el error (mostrar mensaje, reintentar, etc.)
  }
};
