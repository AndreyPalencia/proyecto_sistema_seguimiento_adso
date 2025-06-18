import { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { obtenerReporteGFPIF } from '../../services/ReportesGPFPIF';

const useObtenerReporteGFPIFAprendiz = () => {
  const [loading, setLoading] = useState(false);
  const [reporte, setReporte] = useState(null);
  const { showAlert } = useAlert();

  const fetchReporteGFPIF = async (idReporte) => {
    try {
      setLoading(true);
      const data = await obtenerReporteGFPIF(idReporte);
      setReporte(data);
    } catch (error) {
      console.error('Error al obtener el reporte GFPIF:', error);
      showAlert({
        message: `Error al obtener el reporte. ${error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    reporte,
    fetchReporteGFPIF,
  };
};

export { useObtenerReporteGFPIFAprendiz };
