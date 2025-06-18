import { useState, useEffect, uem } from 'react';
import { obtenerFichaById } from '../services/Fichas.js';

export const useFichaById = (idFicha) => {
  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchFicha = async () => {
    try {
      const res = await obtenerFichaById(idFicha);
      setFicha(res);
    } catch (err) {
      console.error('Error cargar la ficha:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idFicha) fetchFicha();
  }, [idFicha]);

  return { ficha, loading };
};
