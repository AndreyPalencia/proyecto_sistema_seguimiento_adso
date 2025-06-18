import { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { useConfirmDialog } from '../../context/ConfirmDialogContext';
import { eliminarReporteGFPIF } from '../../services/ReportesGPFPIF';

const useEliminarReporteGFPIFAprendiz = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const { showConfirm } = useConfirmDialog();

  const fetchEliminarReporte = async (idReporte, action) => {
    try {
      setLoading(true);
      showConfirm({
        title: '¿Estás seguro de eliminar esta reporte?',
        content: 'Esta acción es irreversible. ¿Quieres continuar?',
        onConfirm: async () => {
          try {
            // Llamas a la API para eliminar la observación
            await eliminarReporteGFPIF(idReporte);
            await action();
            // Muestras un mensaje de éxito
            showAlert({
              message: 'Reporte elimando exitosamente.',
              severity: 'success',
              variant: 'standard',
            });
          } catch (error) {
            console.error('Error al eliminar el reporte:', error);
            showAlert({
              message: `Error al eliminar el reporte. ${error.message}`,
              severity: 'error',
            });
          }
        },
      });
    } catch (error) {
      console.error('Error al eliminar el reporte', error);
      showAlert({
        message: `Error al eliminar el reporte. ${error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchEliminarReporte };
};

export { useEliminarReporteGFPIFAprendiz };
