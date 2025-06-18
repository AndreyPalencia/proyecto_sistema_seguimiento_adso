import { useState, useEffect } from 'react';
import { getAprendicesByEmpresa } from '../../services/FichaAprendiz';

const useAprendicesByEmpresa = (idEmpresa, idInstructor) => {
  const [aprendicesEmpresa, setAprendicesEmpresa] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAprendices = async () => {
    if (!idEmpresa || !idInstructor) return; // prevenir llamadas si faltan datos

    setLoading(true);
    try {
      const aprendices = await getAprendicesByEmpresa(idEmpresa, idInstructor);
      setAprendicesEmpresa(aprendices);
    } catch (error) {
      console.error(
        'Error al obtener los aprendices relacionados con la empresa.',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAprendices();
  }, [idEmpresa, idInstructor]);


  return { loading, aprendicesEmpresa };
};

export { useAprendicesByEmpresa };
