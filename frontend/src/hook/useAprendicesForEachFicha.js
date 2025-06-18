import { useState, useEffect, useMemo } from 'react';
import { getAprendizByFichas } from '../services/FichaAprendiz';

/**
 * Hook personalizado para obtener los aprendices asociados a un conjunto de fichas.
 *
 * @param {Object} props - Propiedades para configurar el hook.
 * @param {Array<string>} props.idFichas - Lista de identificadores de fichas para las que se desean obtener los aprendices.
 * @param {string} props.idInstructor - Identificador del instructor asociado. (Aunque no se usa directamente, está en las dependencias del `useEffect`).
 *
 * @returns {Object} El estado con los datos de los aprendices, estado de carga y posibles errores.
 * @property {Object} aprendices - Un objeto con los aprendices agrupados por `idFicha`.
 * @property {boolean} loading - Un valor booleano que indica si los datos están siendo cargados.
 * @property {string|null} error - Un mensaje de error si ocurre algún problema al obtener los datos de los aprendices.
 *
 * @example
 * // Supongamos que llamamos al hook con las siguientes props:
 * const { aprendices, loading, error } = useAprendicesByFicha({
 *   idFichas: ['ficha1', 'ficha2'],
 *   idInstructor: '123'
 * });
 *
 * // La respuesta sería algo así:
 * {
 *   aprendices: {
 *     ficha1: [
 *       { idFichaAprendiz: 1, nombre: 'Juan Pérez' },
 *       { idFichaAprendiz: 2, nombre: 'Ana Gómez' }
 *     ],
 *     ficha2: [
 *       { idFichaAprendiz: 3, nombre: 'Carlos Martínez' }
 *     ]
 *   },
 *   loading: false,  // Indica que los datos han sido cargados.
 *   error: null // No hubo errores.
 * }
 */
export const useAprendicesForEachFicha = ({ idFichas = [], idInstructor }) => {
  //Estado para almacenar los aprendicesPorFicha, carga y error
  const [aprenidcesForEachFicha, setAprendicesForEachFicha] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Función para obtener los aprendices asociados a las fichas proporcionadas.
   * Se ejecuta cuando el hook se monta o cuando cambian las dependencias `idFichas` o `idInstructor`.
   *
   * Actualiza el estado de `aprendicesPorFicha` con los datos obtenidos, y maneja el estado
   * de carga y posibles errores.
   * 
   * @returns {Promise<void>}
   */
  const obtenerAprendicesByFichas = async () => {
    if (!idFichas.length) {
      setAprendicesForEachFicha({});
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        idFichas.map(async (idFicha) => {
          const response = await getAprendizByFichas(idFicha);
          return {
            idFicha,
            data: response.success
              ? response.data.map((aprendiz) => ({
                  idFichaAprendiz: aprendiz.idFichaAprendiz,
                  nombre: `${aprendiz.Usuario.nombre} ${aprendiz.Usuario.apellido}`,
                }))
              : [],
          };
        })
      );

      const nuevasFichas = {};
      results.forEach(({ idFicha, data }) => {
        nuevasFichas[idFicha] = data;
      });

      setAprendicesForEachFicha(nuevasFichas);
    } catch (error) {
      console.error('Error al obtener los aprendices por ficha:', error);
      setError(
        error || 'Error desconocido al obtener los aprendices por ficha'
      );
    } finally {
      setLoading(false);
    }
  };

  //Hook `useEffect` que ejecuta la petición para obtener los aprendices de todas la ficha relacionada a 
  //un instructor cada vez que cambie el `idInstructor`
  useEffect(() => {
    obtenerAprendicesByFichas();
  }, [idFichas, idInstructor]);

  // Memorizamos el objeto `aprendicesPorFicha` para evitar renders innecesarios.
  const aprendices = useMemo(
    () => aprenidcesForEachFicha,
    [aprenidcesForEachFicha]
  );

  return { aprendices, loading, error };
};
