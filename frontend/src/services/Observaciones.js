import { apiClient } from './Axios';

export const obtenerObservaciones = async (idFichaAprendiz) => {
  const { data } = await apiClient.get(
    `/observaciones/ficha-aprendiz/${idFichaAprendiz}`
  );
  return data.data;
};

export const modificarEstadoObservacion = async (
  idObservacion,
  nuevoEstado
) => {
  const { data } = await apiClient.patch(
    `/observaciones/${idObservacion}/estado`,
    {
      mostrarObservacion: nuevoEstado,
    }
  );
  return data.data;
};

export const crearObservacion = async (FormData) => {
  const { data } = await apiClient.post('/observaciones', FormData);
  return data.data;
};

export const modificarObservacion = async (idObservacion, FormData) => {
  const { data } = await apiClient.put(
    `/observaciones/${idObservacion}`,
    FormData
  );
  return data.data;
};

export const eliminarObservacion = async (idObservacion) => {
  const { data } = await apiClient.delete(`/observaciones/${idObservacion}`);
  return data.data;
};
