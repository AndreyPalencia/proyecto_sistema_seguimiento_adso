import { useState, useEffect } from 'react';
import { obtenerEmpresa } from '../../services/Empresa';

/**
 * Hook personalizado para obtener los detalles de la empresa por su ID.
 *
 * @param {string} idEmpresa - El ID de la empresa que se obtiene desde el contexto o parámetros.
 * @returns {Object} Estado con los datos de la empresa y el estado de carga.
 */
const useEmpresaById = (idEmpresa) => {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!idEmpresa) return; // Si no tenemos un idEmpresa, no hacer nada.

    const fetchEmpresa = async () => {
      setLoading(true);
      try {
        const empresaData = await obtenerEmpresa(idEmpresa); // Llamada a la API para obtener la empresa.
        //console.log('Data', empresaData,)
        setEmpresa(empresaData); // Guardar la información de la empresa en el estado.
      } catch (error) {
        console.error('Error al obtener la empresa:', error?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpresa();
  }, [idEmpresa]); // Re-ejecutar cuando el idEmpresa cambie.

  return { empresa, loading };
};

export default useEmpresaById;
