import { useState } from 'react';
import { eliminarBitacora } from '../../services/Bitacoras';
import { useAlert } from '../../context/AlertContext';
import { useConfirmDialog } from '../../context/ConfirmDialogContext';

const useEliminarBitacora = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { showConfirm } = useConfirmDialog();

  const fetchEliminarBitacora = async (idBitacora, action) => {
    showConfirm({
      title: '¿Estás seguro de eliminar esta bitácora?',
      content: 'Esta acción es irreversible. ¿Quieres continuar?',
      onConfirm: async () => {
        setLoading(true);
        try {
          await eliminarBitacora(idBitacora);
          await action();
          showAlert({
            message: 'Se eliminó la bitácora correctamente.',
            severity: 'info',
            variant: 'standard',
          });
        } catch (error) {
          console.error('Error deleting bitacora:', error);
          showAlert({
            message: `Ocurrió un error al intentar eliminar la bitácora. ${error.message}`,
            severity: 'error',
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return { eliminarBitacora: fetchEliminarBitacora, loading };
};

export { useEliminarBitacora };
