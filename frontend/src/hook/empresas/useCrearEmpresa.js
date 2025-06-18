import { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { crearEmpresa } from '../../services/Empresa';

const useCrearEmpresa = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const fetchCrearEmpresa = async (formDataEmpresa) => {
    try {
      setLoading(true);
      const empresa = await crearEmpresa(formDataEmpresa);

      showAlert({
        message: 'Empresa creada correctamente.',
        severity: 'success',
        variant: 'standard'
      });

      return empresa;
    } catch (error) {
      console.error('Error al crear la empresa:', error);
      showAlert({
        message: `Error al crear la empresa. ${error.message}`,
        severity: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchCrearEmpresa, loading };
};

export { useCrearEmpresa };
