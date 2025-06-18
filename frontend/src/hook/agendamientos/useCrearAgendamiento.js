import { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { createAgendamiento } from '../../services/Agendamientos'; // Asegúrate de importar correctamente

const useCrearAgendamiento = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const fetchCrearAgendamiento = async (formData) => {
    try {
      setLoading(true);
      const agendamiento = await createAgendamiento(formData);

      showAlert({
        message: 'Agendamiento creado con éxito',
        severity: 'success',
        variant: 'standard',
      });

      return agendamiento;
    } catch (error) {
      console.error('Error al crear el agendamiento:', error);
      showAlert({
        title: 'Error',
        message: `Error al crear el agendamiento: ${error.message}`,
        severity: 'error',
        variant: 'filled',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchCrearAgendamiento, loading };
};

export { useCrearAgendamiento };
