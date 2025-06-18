import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';
import { cambiarPassword } from '../../services/Auth';

/**
 * Custom hook to handle password change.
 * @param {function} showAlert - function to display alerts in UI
 * @param {function} cambiarPassword - async function to call API to change password
 */
const useCambiarPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { showAlert } = useAlert();

  const changePassword = async (formData) => {
    try {
      setLoading(true);
      const data = await cambiarPassword(formData);

      if (data.success) {
        showAlert({
          message: 'Contraseña Cambiada Correctamente',
          variant: 'standard',
          severity: 'success',
        });
        navigate('/auth/login');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      showAlert({
        message: `Ocurro un error: ${error.message}`,
        variant: 'standard',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading };
};

export { useCambiarPassword };
