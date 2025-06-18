import { useEffect, useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { obtenerUsuarios } from '../../services/Usuarios';

import { capitalizeFirstLetter } from '../../utils/utils';

const useObtenerUsuarios = () => {
  const [usuarios, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showAlert } = useAlert();

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const usuariosList = await obtenerUsuarios();
      const usuariosTransformados = usuariosList.map((usuario) => ({
        ...usuario,
        rol: capitalizeFirstLetter(usuario.rol),
        estadoUsuario: usuario.estadoUsuario ? 'Activo' : 'Inactivo',
      }));
      setFichas(usuariosTransformados);
    } catch (error) {
      console.error('Error al obtener los usuarios del sistema', error);
      if (error.status === 404) {
        showAlert({
          message: `Ocurrio un error al obtener los usuarios del sistema.`,
          severity: 'warning',
          variant: 'standard',
        });
        return;
      }
      showAlert({
        message: `Error al obtener los usuarios del sistema.`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [showAlert]);

  return { loading, usuarios, refetchUsuarios: fetchUsuarios };
};

export { useObtenerUsuarios };
