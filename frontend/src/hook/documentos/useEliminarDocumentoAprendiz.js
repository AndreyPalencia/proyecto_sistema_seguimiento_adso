import { useState } from 'react';
import { eliminarDocumento } from '../../services/Documentos';
import { useAlert } from '../../context/AlertContext';
import { useConfirmDialog } from '../../context/ConfirmDialogContext';

const useEliminarDocumento = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { showConfirm } = useConfirmDialog();

  const fecthEliminarDocumento = async (idDocumento, action) => {
    showConfirm({
      title: '¿Estás seguro de eliminar este documento?',
      content: 'Esta acción es irreversible. ¿Quieres continuar?',
      onConfirm: async () => {
        setLoading(true);
        try {
          await eliminarDocumento(idDocumento);
          await action();
          showAlert({
            message: 'Se eliminó el documento correctamente.',
            severity: 'info',
            variant: 'standard',
          });
        } catch (error) {
          console.error('Error deleting documento:', error);
          showAlert({
            message: `Ocurrió un error al intentar eliminar el documento. ${error.message}`,
            severity: 'error',
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return { eliminarDocumento: fecthEliminarDocumento, loading };
};

export { useEliminarDocumento };
