import { useState, useEffect } from 'react'; // Se agrega useEffect para manejar cambios en las props
import FormReporteGFIPF from '../FormularioReporteGFIPF/FormReporteGFIPF';
import { useAlert } from '../../../context/AlertContext';
import { useCrearReporteGFPIFAprendiz } from '../../../hook/reportesGFPIF/useCrearReporteGFPIFAprendiz';
import { Box, LinearProgress, Typography, Button, Stack } from '@mui/material';
import { useCheckbox } from '../../../context/CheckboxContext';

const ReportesSecuencialesGFIPF = ({ idsFichaAprendices, onCloseGlobal }) => {
  // Obtenemos la función clearSelection del contexto para limpiar la selección al quitar un aprendiz.
  const { selectMultiple, clearSelection } = useCheckbox();

  // Estado local para almacenar la lista de IDs de aprendices.
  // Se inicializa con la prop `idsFichaAprendices` pero se puede modificar localmente.
  const [currentIdsFichaAprendices, setCurrentIdsFichaAprendices] =
    useState(idsFichaAprendices);
  const [currentIndex, setCurrentIndex] = useState(0); // Índice del aprendiz actual en la lista
  const { showAlert } = useAlert(); // Hook para mostrar alertas

  // Este useEffect se encarga de sincronizar la lista local
  // si la prop `idsFichaAprendices` cambia desde el componente padre.
  // También reinicia el índice a 0 si la lista cambia.
  useEffect(() => {
    setCurrentIdsFichaAprendices(idsFichaAprendices);
    setCurrentIndex(0);
  }, [idsFichaAprendices]); // Dependencia: se ejecuta si `idsFichaAprendices` cambia

  // Función para avanzar al siguiente formulario de reporte
  const handleNext = () => {
    // Si no es el último elemento en la lista, avanza al siguiente índice
    if (currentIndex < currentIdsFichaAprendices.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Si es el último, cierra el proceso global
      onCloseGlobal();
    }
  };

  // Función para retroceder al formulario de reporte anterior
  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Función para quitar el aprendiz actual de la lista de procesamiento
  const handleRemoveFromList = (isNotMessage = false) => {
    const currentIdToRemove = currentIdsFichaAprendices[currentIndex];

    const updatedIds = currentIdsFichaAprendices.filter(
      (id) => id !== currentIdToRemove
    );

    // console.log({ updatedIds, currentIdsFichaAprendices }, 'updateIds');

    if (updatedIds.length === 0 && !isNotMessage) {
      showAlert({
        message: `Último aprendiz eliminado.`,
        severity: 'info',
        variant: 'standard',
      });
      clearSelection();
      onCloseGlobal();
      return;
    }

    let newIndex = currentIndex;

    // Si eliminaste el último, retrocede el índice
    if (currentIndex >= updatedIds.length) {
      newIndex = updatedIds.length - 1;
      // console.log('Hola last');
    }

    setCurrentIdsFichaAprendices(updatedIds);
    setCurrentIndex(newIndex);
    // clearSelection();

    if (!isNotMessage) {
      showAlert({
        message: `Aprendiz con ID ${currentIdToRemove} eliminado de la lista.`,
        severity: 'info',
        variant: 'standard',
      });
    }
  };

  // Hook para la creación de reportes
  const { loading: loadingNuevoReportes, fetchCrearReportesGFPIF } =
    useCrearReporteGFPIFAprendiz();

  // Función que se llama cuando se guarda un nuevo reporte
  const handleNuevoReporte = async (formData) => {
    const idForReport = currentIdsFichaAprendices[currentIndex];
    await fetchCrearReportesGFPIF(idForReport, formData);

    // Remove the current aprendiz from the list after saving
    handleRemoveFromList(true);
  };

  if (currentIdsFichaAprendices.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Todos los reportes han sido procesados o eliminados.</p>
        <Button variant="contained" onClick={onCloseGlobal}>
          Cerrar
        </Button>
      </div>
    );
  }

  return (
    <FormReporteGFIPF
      // Pasa el ID del aprendiz actual al formulario
      key={currentIdsFichaAprendices[currentIndex]}
      idFichaAprendiz={currentIdsFichaAprendices[currentIndex]}
      open={true} // El diálogo siempre está abierto mientras haya aprendices
      onClose={onCloseGlobal} // Función para cerrar el diálogo globalmente
      isMultiple={currentIdsFichaAprendices.length !== 1}
      onNuevoReporte={handleNuevoReporte} // Función para manejar la creación/edición del reporte
      isAnimationProgress // Prop para controlar si el formulario padre muestra su CircularProgress
    >
      <Stack direction="row" spacing={2} sx={{}}>
        {/* Botón "Anterior" */}
        {currentIndex > 0 && (
          <Button color="secondary" variant="contained" onClick={handleBack}>
            Anterior
          </Button>
        )}
        {/* Botón "Quitar de lista" - solo se muestra si quedan elementos en la lista */}
        {currentIdsFichaAprendices.length > 0 && (
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              handleRemoveFromList();
            }}
          >
            Quitar de lista
          </Button>
        )}
        {/* Botón "Siguiente" - solo se muestra si no es el último elemento */}
        {currentIndex < currentIdsFichaAprendices.length - 1 && (
          <Button color="secondary" variant="contained" onClick={handleNext}>
            Siguiente
          </Button>
        )}
      </Stack>
    </FormReporteGFIPF>
  );
};

export default ReportesSecuencialesGFIPF;
