import { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { createAprendicesFichasByExcel } from '../../services/FichaAprendiz';

const useCreateAprendicesByArchivo = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const fetchCrearAprendicesArchivo = async (idFicha, formData) => {
    try {
      setLoading(true);
      const fichaAprendices = await createAprendicesFichasByExcel(
        idFicha,
        formData
      ); // obtienes directamente el dato
      showAlert({
        message: 'Se creó la relaciones ficha-aprendiz exitosamente.',
        severity: 'info',
        variant: 'standard',
      });
      return fichaAprendices;
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

  return { loading, fetchCrearAprendicesArchivo };
};

export { useCreateAprendicesByArchivo };
