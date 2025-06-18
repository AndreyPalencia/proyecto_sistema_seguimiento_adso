import { useState, useEffect, useMemo } from 'react';
import { getAprendizByFichas } from '../services/FichaAprendiz';

/**
 * Hook personalizado para obtener los aprendices asociados a una ficha específica.
 * Utiliza un servicio externo para obtener los datos y los transforma para facilitar su uso en componentes.
 *
 * @param {Object} props - Objeto de parámetros.
 * @param {number|null} [props.idFicha=null] - ID de la ficha para la cual se quieren obtener los aprendices.
 *
 * @returns {Object} Resultado del hook.
 * @property {Array<Object>} aprendicesByFichas - Lista de aprendices asociada a la ficha. Incluye datos del usuario más `idAprendiz` e `idFicha`.
 * @property {boolean} loading - `true` mientras se realiza la petición al backend.
 * @property {Error|string|null} error - Contiene el error generado durante la petición, o `null` si no hubo error.
 *
 * @example
 * const { aprendicesByFichas, loading, error } = useAprendicesByFichas({ idFicha: 123 });
 */

export const useAprendicesByFichas = ({ idFicha = null } = {}) => {
  // Estado para almacenar los aprendicesPorFicha
  const [aprendicesPorFicha, setAprendicesPorFicha] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Función que obtiene los aprendices de una ficha y transforma los datos
   * para exponer sólo lo necesario. Si `idFicha` no está definido, se limpia el estado.
   *
   * @returns {Promise<void>}
   */
  const obtenerAprendicesByFicha = async () => {
    if (!idFicha) {
      setAprendicesPorFicha([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getAprendizByFichas(idFicha);
      const aprendices = response.data;
      const results = aprendices.map(({ Usuario, ...rest }) => ({
        aprendiz: {
          ...Usuario,
          idAprendiz: Usuario.idUsuario,
          idFichaAprendiz: rest.idFichaAprendiz,
        },
        infoFichaAprendiz: {
          ...rest,
          idAprendiz: Usuario.idUsuario,
        },
      }));

      //console.log('Aprendices:', results);
      setAprendicesPorFicha(results);
    } catch (error) {
      console.error('Error al obtener los aprendices ficha:', error);
      setError(
        error || 'Error desconocido al obtener los aprendices por ficha'
      );
    } finally {
      setLoading(false);
    }
  };

  //Hook `useEffect` que ejecuta la petición para obtener los aprendices relacionados a una
  //ficha en especifico cada vez que cambia el `idFicha`
  useEffect(() => {
    obtenerAprendicesByFicha();
  }, [idFicha]);

  // Memorizamos la lista de aprendices y la de infoFichaAprendiz transformada
  const aprendices = useMemo(() => {
    return aprendicesPorFicha.map((item) => item.aprendiz); // Solo devolvemos el objeto `aprendiz`
  }, [aprendicesPorFicha]);

  const infoFichaAprendiz = useMemo(() => {
    return aprendicesPorFicha.map((item) => item.infoFichaAprendiz); // Solo devolvemos el objeto `infoFichaAprendiz`
  }, [aprendicesPorFicha]);

  return { aprendices, infoFichaAprendiz, loading, error };
};
