import { useState } from 'react';
import { eliminarObservacion } from '../../services/Observaciones';
import { useAlert } from '../../context/AlertContext';
import { useConfirmDialog } from '../../context/ConfirmDialogContext';

const useEliminarObservacionAprendiz = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { showConfirm } = useConfirmDialog();

  const fetchEliminarObservacion = async (idObservacion, action) => {
    try {
      setLoading(true);
      showConfirm({
        title: '¿Estás seguro de eliminar esta observación?',
        content: 'Esta acción es irreversible. ¿Quieres continuar?',
        onConfirm: async () => {
          try {
            // Llamas a la API para eliminar la observación
            await eliminarObservacion(idObservacion);
            await action();
            // Muestras un mensaje de éxito
            showAlert({
              message: 'Observación eliminada exitosamente.',
              severity: 'success',
              variant: 'standard',
            });
          } catch (error) {
            console.error('Error al eliminar la observación:', error);
            showAlert({
              message: `Error al eliminar la observación. ${error.message}`,
              severity: 'error',
            });
          }
        },
      });
    } catch (error) {
      console.error('Error al eliminar la observación:', error);
      showAlert({
        message: `Error al eliminar la observación. ${error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchEliminarObservacion };
};

export { useEliminarObservacionAprendiz };
