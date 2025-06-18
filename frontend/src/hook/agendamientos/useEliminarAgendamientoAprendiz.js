import { useState } from 'react';
import { deleteAgendamiento } from '../../services/Agendamientos';
import { useAlert } from '../../context/AlertContext';
import { useConfirmDialog } from '../../context/ConfirmDialogContext';

const useEliminarAgendamientoAprendiz = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { showConfirm } = useConfirmDialog();

  const eliminarAgendamiento = async (idAgendamiento, action) => {
    showConfirm({
      title: '¿Estás seguro de eliminar este agendamiento?',
      content: 'Esta acción es irreversible. ¿Quieres continuar?',
      onConfirm: async () => {
        setLoading(true);
        try {
          const response = await deleteAgendamiento(idAgendamiento);
          //console.log('Respuesta de eliminación:', response);
          await action();
          showAlert({
            message: 'Se eliminó el agendamiento correctamente.',
            severity: 'info',
            variant: 'standard',
          });
        } catch (error) {
          console.error('Error deleting bitacora:', error);
          showAlert({
            message: `Ocurrió un error al intentar eliminar el agendamiento. ${error.message}`,
            severity: 'error',
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return { eliminarAgendamiento, loading };
};

export { useEliminarAgendamientoAprendiz };
