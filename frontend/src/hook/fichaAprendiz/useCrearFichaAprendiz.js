import { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { crearAprendizFicha } from '../../services/FichaAprendiz';

const useCrearFichaAprendiz = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const fetchCrearAprendizFicha = async (formData) => {
    try {
      setLoading(true);
      const fichaAprendiz = await crearAprendizFicha(formData); // obtienes directamente el dato
      showAlert({
        message: 'Se creó la relación ficha-aprendiz exitosamente.',
        severity: 'info',
        variant: 'standard',
      });
      return fichaAprendiz;
    } catch (error) {
      //console.log(error, 'response')
      if (error?.status === 409) {
        showAlert({
          message: `Conflicto: ${error.message || 'Ya existe la relación.'}`,
          severity: 'warning',
        });
      } else {
        showAlert({
          message: `Error: ${error?.message || 'Error inesperado.'}`,
          severity: 'error',
        });
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchCrearAprendizFicha };
};

export { useCrearFichaAprendiz };
