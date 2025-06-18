import { useEffect, useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { obtenerUsuario } from '../../services/Usuarios';

export const useObtenerUsuarioById = (idUsuario) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showAlert } = useAlert();

  useEffect(() => {
    if (!idUsuario) return;

    let isActive = true;

    const fetchUsuario = async () => {
      try {
        const usuario = await obtenerUsuario(idUsuario);
        if (isActive) setUsuario(usuario);
      } catch (error) {
        if (!isActive) return;

        console.error(
          'Error al intentar obtener la información del usuario:',
          error
        );

        if (error?.status === 404) {
          showAlert({
            message: 'Ocurrió un error al obtener la información del usuario.',
            severity: 'warning',
            variant: 'standard',
          });
          return;
        }

        showAlert({
          message: 'Error al intentar obtener la información del usuario.',
          severity: 'error',
        });
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchUsuario();

    return () => {
      isActive = false;
      setUsuario(null);
      setLoading(true);
    };
  }, [idUsuario, showAlert]);

  return { usuario, loading };
};
