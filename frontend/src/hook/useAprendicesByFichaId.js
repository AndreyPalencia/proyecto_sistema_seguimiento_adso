import { useState, useEffect } from 'react';
import { getAprendizByFichas } from '../services/FichaAprendiz';

export const useAprendicesByFichaId = (idFicha) => {
  const [aprendices, setAprendices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idFicha) return;

    const fetchAprendices = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getAprendizByFichas(idFicha);
        if (response.success) {
          const data = response.data.map((aprendiz) => ({
            idFichaAprendiz: aprendiz.idFichaAprendiz,
            nombre: `${aprendiz.Usuario.nombre} ${aprendiz.Usuario.apellido}`,
           
          }));
           //console.log(response.data);
          setAprendices(data);
        } else {
          setAprendices([]);
          setError('Failed to fetch aprendices');
        }
      } catch (err) {
        console.error('Error fetching aprendices:', err);
        setError('Unexpected error fetching aprendices');
        setAprendices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAprendices();
  }, [idFicha]);

  return { aprendices, loading, error };
};
