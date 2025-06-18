import { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { crearUsuario } from '../../services/Usuarios';

const useCrearUsuario = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const fetchCrearUsuario = async (formDataUsuario) => {
    try {
      setLoading(true);
      const formData = new FormData();

      for (const key in formDataUsuario) {
        formData.append(key, formDataUsuario[key]);
      }
      const usuario = await crearUsuario(formData);

      //console.log(usuario);

      showAlert({
        message: 'Usuario creado correctamente.',
        severity: 'success',
        variant: 'standard',
      });

      //console.log(usuario, 'mesaje');

      return usuario;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      showAlert({
        message: `Error al crear el usuario. ${error.message}`,
        severity: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchCrearUsuario, loading };
};

export { useCrearUsuario };
