import { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { modificarUsuario } from '../../services/Usuarios';

const useModificarUsuario = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const editarUsuario = async (idUsuario, formDataUsuario) => {
    setLoading(true);
    try {
      let dataToSend;

      if (formDataUsuario.archivo instanceof File) {
        dataToSend = new FormData();
        for (const key in formDataUsuario) {
          if (
            formDataUsuario[key] !== undefined &&
            formDataUsuario[key] !== null
          ) {
            dataToSend.append(key, formDataUsuario[key]);
          }
        }
      } else {
        dataToSend = { ...formDataUsuario };
      }

      await modificarUsuario(idUsuario, dataToSend);

      showAlert({
        message: 'Se actualizó con éxito el usuario.',
        severity: 'info',
        variant: 'standard',
      });

      //return updatedDocumento;
    } catch (error) {
      console.error('Error al actualizar la información del usuario:', error);
      if (error.status === 404) {
        showAlert({
          message: `Ocurrio un error al actualizar los datos del usuario.`,
          severity: 'warning',
          variant: 'standard',
        });
        return;
      }
      showAlert({
        message: `Error al actualizar la información del usuario. ${error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { editarUsuario, loading };
};

export { useModificarUsuario };
