import { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { modificarEmpresa } from '../../services/Empresa';

const useEditarEmpresa = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const editarEmpresa = async (idEmpresa, formEmpresa) => {
    setLoading(true);

    try {
      const updateEmpresa = await modificarEmpresa(idEmpresa, formEmpresa);
      showAlert({
        message: 'Se actualizo con exito la empresa.',
        variant: 'standard',
        severity: 'info',
      });
      return updateEmpresa;
    } catch (error) {
      console.error('Error al actualizar los datos', error);

      if (error.status === 404) {
        showAlert({
          message: `No se realizaron ningún cambio a la información de la empresa.`,
          severity: 'warning',
          variant: 'standard',
        });
        return;
      }

      showAlert({
        message: `Error al modificar el empresa: ${error.message}`,
        severity: 'error',
      });

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { editarEmpresa, loading };
};

export { useEditarEmpresa };
