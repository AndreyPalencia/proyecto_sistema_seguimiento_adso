import { useEffect, useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { obtenerUsuarios } from '../../services/Usuarios';

import { capitalizeFirstLetter } from '../../utils/utils';

const useObtenerUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosOriginales, setUsuariosOriginales] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showAlert } = useAlert();

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const usuariosList = await obtenerUsuarios();
      const usuariosTransformados = usuariosList.map((usuario) => ({
        ...usuario,
        rol: capitalizeFirstLetter(usuario.rol),
      }));
      setUsuariosOriginales(usuariosList)
      setUsuarios(usuariosTransformados);
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

  // Función de búsqueda por propiedad y valor
  const buscarUsuarios = (propiedad, valor) => {
    if (!propiedad || !valor) return usuarios;

    const termino = valor.toString().toLowerCase();

    return usuariosOriginales.filter((usuario) => {
      const campo = usuario[propiedad];
      if (typeof campo === 'string') {
        return campo.toLowerCase().includes(termino);
      }
      if (typeof campo === 'boolean') {
        return campo === (valor === 'true' || valor === true);
      }
      if (typeof campo === 'number') {
        return campo === Number(valor);
      }
      return false;
    });
  };

  useEffect(() => {
    fetchUsuarios();
  }, [showAlert]);

  return {
    loading,
    usuarios,
    refetchUsuarios: fetchUsuarios,
    buscarUsuarios, // función: (propiedad, valor) => array filtrado
  };
};

export { useObtenerUsuarios };
