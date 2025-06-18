import { useState, useEffect, useMemo } from 'react';
import { obtenerBitacorasByIdFichaAprendiz } from '../../services/Bitacoras';
import { convertirEnFechaColombiana } from '../../utils/utils';
import { useAlert } from '../../context/AlertContext';

const useBitacorasAprendiz = (idFichaAprendiz) => {
  const [bitacoras, setBitacoras] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showAlert } = useAlert();

  const MAX_BITACORAS = 12;

  const fetchBitacoras = async () => {
    try {
      const data = await obtenerBitacorasByIdFichaAprendiz(idFichaAprendiz);
      const bitacorasConFecha = data.map((bitacora) => ({
        ...bitacora,
        fechaUltimaActualizacion: convertirEnFechaColombiana(
          bitacora.fechaUltimaActualizacion
        ),
      }));
      setBitacoras(bitacorasConFecha);
    } catch (error) {
      console.error(
        'Error al obtener las bitácoras relaciondas al aprendiz:',
        error?.message
      );

      if (error.status === 404) {
        setBitacoras([]);
      } else {
        showAlert({
          message: `Error al obtener los bitácoras del aprendiz. ${error.message}`,
          severity: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (idFichaAprendiz) fetchBitacoras();
  }, [idFichaAprendiz, showAlert]);

  const datosFormulario = useMemo(() => {
    const numerosOcupados = bitacoras
      .map((b) => b.numeroBitacora)
      .filter((n) => typeof n === 'number')
      .sort((a, b) => a - b);

    // Encuentra el número más bajo que NO está en la lista ocupada
    let numeroDisponible = null;
    for (let i = 1; i <= MAX_BITACORAS; i++) {
      if (!numerosOcupados.includes(i)) {
        numeroDisponible = i;
        break;
      }
    }

    return {
      total: bitacoras.length,
      ocupados: numerosOcupados,
      max: MAX_BITACORAS,
      numeroSiguiente: numeroDisponible, // null si ya están ocupados los 12
    };
  }, [bitacoras]);

  return {
    bitacoras,
    loading,
    datosFormulario,
    refetchBitacoras: fetchBitacoras,
  };
};

export { useBitacorasAprendiz };
