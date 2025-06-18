import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { getAprendizByIdFichaAprendiz } from '../services/FichaAprendiz';

const AprendizContext = createContext();

export const AprendizProvider = ({ children }) => {
  const [aprendiz, setAprendiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Carga un aprendiz desde el servicio, filtrando por ficha e ID de usuario.
   * Este método espera que el servicio traiga una lista y selecciona solo el que coincide.
   *
   * @param {number} idFicha
   * @param {number} idUsuario
   */
  const obtenerAprendiz = async (idFicha, idUsuario) => {
    //console.log('obtener', idFicha, idUsuario);
    setLoading(true);
    setError(null);
    try {
      const encontrado = await getAprendizByIdFichaAprendiz(idFicha, idUsuario);
      if (encontrado) {
        const { Usuario, Ficha, ...rest } = encontrado;
        setAprendiz({
          idUsuario: Usuario.idUsuario,
          idInstructor: Ficha.idInstructor,
          aprendiz: {
            ...Usuario,
            idAprendiz: Usuario.idUsuario,
            idFichaAprendiz: rest.idFichaAprendiz,
            idInstructor: Ficha.idInstructor,
          },
          infoFichaAprendiz: {
            ...rest,
            idAprendiz: Usuario.idUsuario,
            idInstructor: Ficha.idInstructor,
          },
        });

        //console.log(aprendiz, 'aprendiz');
      } else {
        setAprendiz(null);
        setError('Aprendiz no encontrado');
      }
    } catch (error) {
      setError(error || 'Error al obtener el aprendiz');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Devuelve una propiedad específica del aprendiz cargado.
   *
   * @param {'aprendiz' | 'infoFichaAprendiz'} tipo
   * @returns {object|null}
   */
  const getPropiedad = (tipo = 'aprendiz') => {
    return aprendiz?.[tipo] || null;
  };

  /**
   * Actualiza una propiedad específica (como 'infoFichaAprendiz' o 'aprendiz') del aprendiz actual.
   *
   * @param {string} propiedad
   * @param {object} nuevaInfo
   */
  const actualizarPropiedad = (propiedad = 'aprendiz', nuevaInfo = {}) => {
    if (!aprendiz || !aprendiz[propiedad]) return;

    setAprendiz((prev) => ({
      ...prev,
      [propiedad]: {
        ...prev[propiedad],
        ...nuevaInfo,
      },
    }));
  };

  const contextValue = useMemo(
    () => ({
      aprendiz,
      loading,
      error,
      obtenerAprendiz,
      getPropiedad,
      actualizarPropiedad,
    }),
    [aprendiz, loading, error]
  );

  return (
    <AprendizContext.Provider value={contextValue}>
      {children}
    </AprendizContext.Provider>
  );
};

export const useAprendiz = () => {
  const context = useContext(AprendizContext);
  if (!context) {
    throw new Error('useAprendiz debe usarse dentro de un AprendizProvider');
  }
  return context;
};
