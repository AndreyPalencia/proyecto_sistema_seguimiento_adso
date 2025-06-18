import { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { modificarReporteGFPIF } from '../../services/ReportesGPFPIF';

const useEditarReporteGFPIFAprendiz = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const fetchEditarReporte = async (idReporte, formData) => {
    try {
      setLoading(true);
      const tipoReporte =
        formData?.infoSeguimiento?.infoSeguimientoInforme?.tipoInforme;
      console.log('tipoInforme:', tipoReporte);

      const fechaUltimaActualizacion = new Date().toISOString().slice(0, 10);
      console.log('fechaUltimaActualizacion:', fechaUltimaActualizacion);
      const formDataReporte = {
        tipoReporte: tipoReporte ? 'Final' : 'Parcial',
        fechaUltimaActualizacion,
        datosReporteJSON: {
          ...formData,
        },
      };
      await modificarReporteGFPIF(idReporte, formDataReporte);
      showAlert({
        severity: 'info',
        message: 'Se ha modficado el reporte satisfatoriamente.',
        variant: 'standard',
      });
    } catch (error) {
      console.error(`Error al editar el reporte`, error);
      showAlert({
        message: `Error al editar el reporte. ${error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, fetchEditarReporte };
};

export { useEditarReporteGFPIFAprendiz };
