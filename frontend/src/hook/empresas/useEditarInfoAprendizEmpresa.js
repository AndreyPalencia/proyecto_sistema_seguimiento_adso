import { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { modificarFichaAprendiz } from '../../services/FichaAprendiz';

const useEditarInfoAprendizEmpresa = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const editarInfoAprendizEmpresa = async (
    idFichaAprendiz,
    formFichaAprendiz
  ) => {
    try {
      setLoading(true);
      const updateFichaAprendiz = await modificarFichaAprendiz(
        idFichaAprendiz,
        formFichaAprendiz
      );
      showAlert({
        message:
          'Se actualizo con exito la información sobre practicas del aprendiz.',
        variant: 'standard',
        severity: 'info',
      });
      return updateFichaAprendiz;
    } catch (error) {
      console.error('Error al actualizar los datos', error);
      if (error.status === 404) {
        showAlert({
          message: `No se realizaron ningún cambio a la información del sobre el aprendiz y la empresa.`,
          severity: 'warning',
          variant: 'standard',
        });
        return;
      }
      showAlert({
        message: `Error al modificar la información sobre practicas del aprendiz. : ${error.message}`,
        severity: 'error',
        variant: 'filled',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { editarInfoAprendizEmpresa, loading };
};

export { useEditarInfoAprendizEmpresa };
