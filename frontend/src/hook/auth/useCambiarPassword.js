import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';
import { cambiarPassword, cambiarPasswordAdmin } from '../../services/Auth';

/**
 * Custom hook to handle password change with optional mode.
 */
const useCambiarPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  /**
   * Changes password based on the `opcion` type.
   * @param {Object} formData - Form data containing passwords
   * @param {'admin' | 'normal'} [opcion] - Optional mode to determine which API to call
   */
  const changePassword = async (formData, opcion = 'normal') => {
    try {
      setLoading(true);

      // Elegir servicio según la opción
      const data =
        opcion === 'admin'
          ? await cambiarPasswordAdmin(formData)
          : await cambiarPassword(formData);

      if (data.success) {
        showAlert({
          message: 'Contraseña cambiada correctamente',
          variant: 'standard',
          severity: 'success',
        });
        navigate('/auth/login');
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      showAlert({
        message: `Ocurrió un error: ${error.message}`,
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
