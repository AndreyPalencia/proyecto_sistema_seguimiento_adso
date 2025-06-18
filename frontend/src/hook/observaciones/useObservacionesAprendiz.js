import { useEffect, useState } from 'react';
import { obtenerObservaciones } from '../../services/Observaciones';

export const useObservacionesAprendiz = (idFichaAprendiz) => {
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchObservaciones = async () => {
    setLoading(true);
    try {
      const observaciones = await obtenerObservaciones(idFichaAprendiz);

      setObservaciones(observaciones || []);
    } catch (error) {
      console.error('Error al obtener las observaciones:', error);
      setError(error);
      setObservaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!idFichaAprendiz) return;
    fetchObservaciones();
  }, [idFichaAprendiz]);

  return { observaciones, loading, error, refetchObservaciones: fetchObservaciones };
};
