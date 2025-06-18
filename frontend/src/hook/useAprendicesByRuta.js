import { useEffect, useState } from 'react';
import { useAprendices } from '../context/AprendicesContext';

export const useAprendicesByRuta = (idAprendiz, tipoInfo = 'aprendiz') => {
  const [aprendiz, setAprendiz] = useState(null);

  const { aprendices, seleccionarAprendizByPropiedad } = useAprendices();

  useEffect(() => {
    if (!aprendices || aprendices.length === 0) return;

    const seleccionado = seleccionarAprendizByPropiedad(idAprendiz, tipoInfo);
    if (seleccionado) {
      setAprendiz(seleccionado);
    }
  }, [aprendices, idAprendiz]);

  const datosCargados = !!aprendiz;

  return {
    aprendiz,
    datosCargados,
  };
};
