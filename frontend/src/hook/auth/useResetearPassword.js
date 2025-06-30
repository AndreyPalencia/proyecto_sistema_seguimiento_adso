import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetearPassword } from '../../services/Auth';
import { useAlert } from '../../context/AlertContext';

const useResetearPassword = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const resetear = async (formData) => {
    try {
      setLoading(true);
      const response = await resetearPassword(formData);

      showAlert({
        message: 'Contraseña cambiada correctamente',
        variant: 'standard',
        severity: 'success',
      });
      navigate('/auth/login');
      return response;
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      showAlert({
        message: `Error al cambiar la contraseña: ${error.message}`,
        variant: 'standard',
        severity: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { resetear, loading };
};

export default useResetearPassword;
