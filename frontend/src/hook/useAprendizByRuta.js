import { useEffect, useState } from 'react';
import { useAprendiz } from '../context/AprendizContext';

export const useAprendizByRuta = (tipoInfo = 'aprendiz') => {
  const [aprendizInfo, setAprendizInfo] = useState(null);

  const { aprendiz, getPropiedad } = useAprendiz();

  useEffect(() => {
    if (!aprendiz || aprendiz.length === 0) return;

    const seleccionado = getPropiedad(tipoInfo);
    if (seleccionado) {
      setAprendizInfo(seleccionado);
    }
  }, [aprendiz]);

  const datosCargados = !!aprendiz;

  return {
    aprendizInfo,
    datosCargados,
  };
};
