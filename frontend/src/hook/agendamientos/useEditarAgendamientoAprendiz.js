import { useState } from 'react';
import { updateAgendamiento } from '../../services/Agendamientos';
import { useAlert } from '../../context/AlertContext';

const useEditarAgendamientoAprendiz = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const editarAgendamiento = async (idAgendamiento, agendamientoEditado) => {
    setLoading(true);
    try {
      await updateAgendamiento(idAgendamiento, agendamientoEditado);

      showAlert({
        message: 'Se actualizó con éxito el agendamiento.',
        severity: 'info',
        variant: 'standard',
      });

      //return agendameintoActualizado;
    } catch (error) {
      console.error('Error al editar el agendamiento:', error);
      showAlert({
        message: `Error al actualizar el agendamiento. ${error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { editarAgendamiento, loading };
};

export { useEditarAgendamientoAprendiz };
