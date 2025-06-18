import { useState, useEffect } from 'react';
import { obtenerReportesGFPIF } from '../../services/ReportesGPFPIF';
import { useAlert } from '../../context/AlertContext';

const useReportesGFPIFAprendiz = ({ idFichaAprendiz }) => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showAlert } = useAlert();

  const fetchReportesGFPIF = async () => {
    try {
      setLoading(true);
      const reportes = await obtenerReportesGFPIF(idFichaAprendiz);
      const reportesConFecha = reportes.map((reporte) => ({
        ...reporte,
      }));
      setReportes(reportesConFecha);
    } catch (error) {
      console.error(
        'Error al obtener los reportes relaciondas al aprendiz:',
        error
      );
      if (error.status === 500) {
        showAlert({
          message: `Error al obtener los reportes relacionados al aprendiz. ${error.message}`,
          severity: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (idFichaAprendiz) fetchReportesGFPIF();
  }, [idFichaAprendiz, showAlert]);

  return { reportes, loading, refetchReportesGFPIF: fetchReportesGFPIF };
};

export { useReportesGFPIFAprendiz };
