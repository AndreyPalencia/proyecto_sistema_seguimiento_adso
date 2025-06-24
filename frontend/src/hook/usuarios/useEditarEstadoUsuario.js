import { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { modificarEstadoUsuario } from '../../services/Usuarios';

const useEditarEstadoUsuario = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const editarEstadoUsuario = async (idUsuario, estado) => {
    setLoading(true);
    try {
      await modificarEstadoUsuario(parseInt(idUsuario), estado);
      showAlert({
        message: 'Se actualizó con éxito el estado del usuario.',
        severity: 'info',
        variant: 'standard',
      });
    } catch (error) {
      console.error('Error al actualizar el estado del usuario:', error);
      if (error.status === 404) {
        showAlert({
          message: `Ocurrio un error al actualizar el estado del usuario.`,
          severity: 'warning',
          variant: 'standard',
        });
        return;
      }
      showAlert({
        message: `Error al actualizar la estado del usuario. ${error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { editarEstadoUsuario, loading };
};

export { useEditarEstadoUsuario };
