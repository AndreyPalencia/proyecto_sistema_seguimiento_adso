import { apiFileClient } from './Axios';

import {
  readBlobAsText,
  downloadBlob,
  getFileNameFromContentDisposition,
} from '../utils/responseUtils';
export const descarReporteFichaGeneral = async (datos) => {
  const response = await apiFileClient.post(
    '/archivos-generados/reporte-ficha-aprendices',
    datos,
    { responseType: 'blob' }
  );

  const fileName = getFileNameFromContentDisposition(
    response.headers['content-disposition'],
    'reporte.docx'
  );

  const blob = new Blob([response.data], {
    type: response.headers['content-type'],
  });
  downloadBlob(blob, fileName);

  return response;
};

export const descarDocumentosFicha = async (idFicha) => {
  try {
    const response = await apiFileClient.get(
      `/archivos-generados/descargar-zip-ficha/${idFicha}`,
      { responseType: 'blob' }
    );

    const fileName = getFileNameFromContentDisposition(
      response.headers['content-disposition'],
      'documentos_aprendices.zip'
    );

    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    });
    downloadBlob(blob, fileName);

    return response;
  } catch (error) {
    console.error('Error downloading ZIP:', error);
    throw error;
  }
};

export const descargarReporteAprendicesSinVisitas = async (
  idInstructor,
  formData
) => {
  console.log(idInstructor, 'd');
  const response = await apiFileClient.post(
    `/archivos-generados/reporte-aprendices-agendamiento-no-realizados-fichas/instructor/${idInstructor}`,
    formData,
    { responseType: 'blob' }
  );

  const fileName = getFileNameFromContentDisposition(
    response.headers['content-disposition'],
    'Reportes_Aprendices_Sin_Visitas.pdf'
  );

  const blob = new Blob([response.data], {
    type: response.headers['content-type'],
  });
  downloadBlob(blob, fileName);

  return response;
};

export const descargarReporteAprendicesVisitasNoRealizados = async (
  idInstructor,
  formData
) => {
  const response = await apiFileClient.post(
    `/archivos-generados/reporte-aprendices-agendamiento-no-realizados-fichas/instructor/${idInstructor}`,
    formData,
    { responseType: 'blob' }
  );

  const fileName = getFileNameFromContentDisposition(
    response.headers['content-disposition'],
    'Reportes_Aprendices_Visitas_Pendientes.pdf'
  );

  const blob = new Blob([response.data], {
    type: response.headers['content-type'],
  });

  // Check if blob is JSON error response instead of PDF
  try {
    const text = await readBlobAsText(blob);
    const json = JSON.parse(text);
    // If parsing succeeds, treat it as an error
    throw new Error(json.message || 'Server returned an error');
  } catch {
    // JSON parsing failed, so blob is likely PDF as expected
  }

  downloadBlob(blob, fileName);

  return response.data;
};

export const descargarReporteRutaAgendamientosMaps = async (
  idInstructor,
  formData
) => {
  const response = await apiFileClient.post(
    `/archivos-generados/ruta-aprendices-visitas/maps/instructor/${idInstructor}`,
    formData,
    { responseType: 'blob' }
  );

  const fileName = getFileNameFromContentDisposition(
    response.headers['content-disposition'],
    `Reporte_Ruta_Agendamientos_${new Date().toISOString().split('T')[0]}`
  );

  const blob = new Blob([response.data], {
    type: response.headers['content-type'],
  });

  // Check if blob is JSON error response instead of PDF
  try {
    const text = await readBlobAsText(blob);
    const json = JSON.parse(text);
    // If parsing succeeds, treat it as an error
    throw new Error(json.message || 'Server returned an error');
  } catch {
    // JSON parsing failed, so blob is likely PDF as expected
  }

  downloadBlob(blob, fileName);

  return response.data;
};
