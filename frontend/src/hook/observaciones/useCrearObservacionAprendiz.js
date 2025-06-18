import { useState } from 'react';
import { crearObservacion } from '../../services/Observaciones';
import { useAlert } from '../../context/AlertContext';

const useCrearObservacionAprendiz = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const fetchCrearObservacion = async (formDataObservacion) => {
    try {
      setLoading(true);
      await crearObservacion(formDataObservacion);
      showAlert({
        message: 'Observación creada existosamente.',
        severity: 'success',
        variant: 'standard',
      });
      //return observacion;
    } catch (error) {
      console.error('Error al crear observación:', error);
      showAlert({
        message: `Error al crear la observación. ${error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchCrearObservacion };
};

export { useCrearObservacionAprendiz };
