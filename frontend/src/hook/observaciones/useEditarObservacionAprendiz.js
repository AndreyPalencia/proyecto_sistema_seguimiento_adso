import { useState } from 'react';
import { modificarObservacion } from '../../services/Observaciones';
import { useAlert } from '../../context/AlertContext';

const useEditarObservacionAprendiz = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const fetchEditarObservacion = async (idObservacion, formDataObservacion) => {
    try {
      setLoading(true);
      await modificarObservacion(idObservacion, formDataObservacion);
      showAlert({
        message: 'Observación actualizada existosamente.',
        severity: 'success',
        variant: 'standard',
      });
      //return observacion;
    } catch (error) {
      console.error('Error al actulizar observación:', error);
      showAlert({
        message: `Error al actulizar la observación. ${error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchEditarObservacion };
};

export { useEditarObservacionAprendiz };
