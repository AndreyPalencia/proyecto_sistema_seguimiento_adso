import { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { crearFicha } from '../../services/Fichas';

const useCrearFicha = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const fetchCrearFicha = async (formDataFicha) => {
    try {
      setLoading(true);
      await crearFicha(formDataFicha);

      showAlert({
        message: 'Se agregó una nueva ficha al sistema.',
        severity: 'success',
        variant: 'standard',
      });

      return true;
    } catch (error) {
      showAlert({
        message: `Error al crear una nueva ficha. ${error.message}`,
        severity: 'error',
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  return { fetchCrearFicha, loading };
};

export { useCrearFicha };
