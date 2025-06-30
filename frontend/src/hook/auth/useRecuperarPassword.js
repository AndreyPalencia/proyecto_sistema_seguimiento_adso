import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recuperarPassword } from '../../services/Auth';
import { useAlert } from '../../context/AlertContext';

const useRecuperarPassword = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const recuperar = async (formData) => {
    try {
      setLoading(true);
      const response = await recuperarPassword(formData);

      showAlert({
        message: 'Correo de recuperación enviado.',
        variant: 'standard',
        severity: 'success',
      });
      navigate('/auth/login');
      return response;
    } catch (error) {
      console.error('Error al recuperar la contraseña:', error);

      showAlert({
        message: `No se pudo enviar el correo de recuperación.  ${error.message}`,
        variant: 'standard',
        severity: 'warning',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { recuperar, loading };
};

export default useRecuperarPassword;
