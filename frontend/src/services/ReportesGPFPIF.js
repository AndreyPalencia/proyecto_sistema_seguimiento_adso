import { apiClient } from './Axios';

export const crearReporteGFPIF = async (idFichaAprendiz, formData) => {
  const { data } = await apiClient.post(
    `/reportes-gfpif/ficha-aprendiz/${idFichaAprendiz}`,
    formData
  );
  return data.data;
};

export const eliminarReporteGFPIF = async (idReporte) => {
  const { data } = await apiClient.delete(
    `/reportes-gfpif/reporte/${idReporte}`
  );
  return data.data;
};

export const modificarReporteGFPIF = async (idReporte, formData) => {
  const { data } = await apiClient.put(
    `/reportes-gfpif/reporte/${idReporte}`,
    formData
  );
  return data.data;
};

export const obtenerReportesGFPIF = async (idFichaAprendiz) => {
  const { data } = await apiClient.get(
    `/reportes-gfpif/ficha-aprendiz/${idFichaAprendiz}`
  );
  return data.data;
};

export const obtenerReporteGFPIF = async (idReporte) => {
  const { data } = await apiClient.get(`/reportes-gfpif/reporte/${idReporte}`);
  return data.data; // según tu estructura de ApiResponse
};

export const descargarReportesGFIPF = async (
  idFicha,
  idFichaAprendiz,
  idReporte
) => {
  try {
    const response = await apiClient.post(
      `/reportes-gfpif/ficha/${idFicha}/ficha-aprendiz/${idFichaAprendiz}/reporte/${idReporte}/`,
      null, // no envías body
      {
        responseType: 'blob',
      }
    );

    // Obtener el nombre del archivo desde el encabezado Content-Disposition
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'reporte.docx'; // valor por defecto

    if (contentDisposition && contentDisposition.includes('filename')) {
      const match = contentDisposition.match(
        /filename\*?=(?:UTF-8'')?["']?([^"';\n]+)/
      );
      if (match && match[1]) {
        fileName = decodeURIComponent(match[1]);
      }
    }

    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al descargar el reporte:', error);
    throw error;
  }
};
