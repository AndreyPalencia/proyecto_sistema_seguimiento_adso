import { useState } from 'react';
import { modificarBitacora } from '../../services/Bitacoras';
import { useAlert } from '../../context/AlertContext';
import { convertirEnFechaColombiana } from '../../utils/utils';

const useEditarBitacora = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const editarBitacora = async (idBitacora, bitacoraEditada) => {
    setLoading(true);
    try {
      let dataToSend;

      if (bitacoraEditada.archivo instanceof File) {
        dataToSend = new FormData();
        for (const key in bitacoraEditada) {
          if (
            bitacoraEditada[key] !== undefined &&
            bitacoraEditada[key] !== null
          ) {
            dataToSend.append(key, bitacoraEditada[key]);
          }
        }
      } else {
        dataToSend = { ...bitacoraEditada };
      }

      // Obtener la bitácora actualizada
      await modificarBitacora(idBitacora, dataToSend);

      showAlert({
        message: 'Se actualizó con éxito la bitácora.',
        severity: 'info',
        variant: 'standard',
      });

      //return updatedBitacora;
    } catch (error) {
      console.error('Error al editar la bitácora:', error);
      showAlert({
        message: `Error al actualizar la bitácora. ${error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { editarBitacora, loading };
};

export { useEditarBitacora };
