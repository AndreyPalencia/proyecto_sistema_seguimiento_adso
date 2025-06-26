import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAprendices } from '../context/AprendicesContext'; // Asumido que tienes este contexto
import { useAprendiz } from '../context/AprendizContext';

/**
 * Hook `useLoadDataOnRouteMatch`
 *
 * Este hook escucha cambios en la ruta actual (`location.pathname`) y verifica si coincide con
 * alguno de los patrones definidos en `routes`. Si existe coincidencia, ejecuta la función asociada
 * (`fetchData`) pasando los parámetros extraídos de la URL.
 *
 * Su propósito principal es cargar datos automáticamente según la ruta navegada, sin necesidad
 * de que cada página maneje manualmente esa lógica.
 *
 *
 * @example
 * // Se debe usar dentro de un layout que envuelva rutas protegidas o dashboard
 * useLoadDataOnRouteMatch();
 *
 * @returns {void} No retorna ningún valor.
 */
export const useLoadDataOnRouteMatch = () => {
  const location = useLocation();
  const { obtenerAprendicesByFicha, aprendices } = useAprendices();
  const { aprendiz, obtenerAprendiz } = useAprendiz();

  /**
   * Reutiliza la lógica para cargar aprendices por ficha, evitando recargas innecesarias.
   *
   * @param {string} idFicha
   */
  const fetchAprendicesIfNotLoaded = async ({ idFicha }) => {
    try {
      if (aprendices.length > 0) return;
      await obtenerAprendicesByFicha(idFicha);
    } catch (error) {
      console.error(
        'Error al cargar los datos de aprendices de la ficha:',
        error.message
      );
    }
  };

  const fetchAprendizIfNotLoaded = async ({ idAprendiz, idFicha }) => {
    try {
      if (aprendiz !== null) return;
      await obtenerAprendiz(idFicha, idAprendiz);
    } catch (error) {
      console.error(
        'Error al cargar los datos del aprendiz de la ficha:',
        error.message
      );
    }
  };

  /**
   * Rutas que activan carga de datos automática
   */
  const routes = [
    {
      pattern: /\/ficha\/(\d+)\/aprendiz\/(\d+)\/empresa\/?$/,
      param: ['idFicha', 'idAprendiz'],
      fetchData: fetchAprendicesIfNotLoaded,
    },
    {
      pattern: /\/ficha\/(\d+)\/aprendiz\/(\d+)\/observaciones\/?$/,
      param: ['idFicha', 'idAprendiz'],
      fetchData: fetchAprendicesIfNotLoaded,
    },
    {
      pattern: /\/ficha\/(\d+)\/aprendiz\/(\d+)\/seguimiento\/?$/,
      param: ['idFicha', 'idAprendiz'],
      fetchData: fetchAprendicesIfNotLoaded,
    },
    {
      pattern:
        /\/admin\/rol\/aprendiz\/(\d+)\/ficha\/(\d+)\/reportes-gfpi-f\/?$/,
      param: ['idAprendiz', 'idFicha'], // importa el orden
      fetchData: fetchAprendizIfNotLoaded,
    },
    {
      pattern: /\/ficha\/(\d+)\/aprendiz\/(\d+)\/reportes-gfpi-f\/?$/,
      param: ['idFicha', 'idAprendiz'],
      fetchData: fetchAprendicesIfNotLoaded,
    },
    {
      pattern: /\/aprendiz\/(\d+)\/ficha\/(\d+)\/empresa\/?$/,
      param: ['idAprendiz', 'idFicha'],
      fetchData: fetchAprendizIfNotLoaded,
    },
    {
      pattern: /\/aprendiz\/(\d+)\/ficha\/(\d+)\/seguimiento\/?$/,
      param: ['idAprendiz', 'idFicha'],
      fetchData: fetchAprendizIfNotLoaded,
    },
    {
      pattern: /\/aprendiz\/(\d+)\/ficha\/(\d+)\/observaciones\/?$/,
      param: ['idAprendiz', 'idFicha'],
      fetchData: fetchAprendizIfNotLoaded,
    },
    {
      pattern: /\/aprendiz\/(\d+)\/ficha\/(\d+)\/calendario-ficha\/?$/,
      param: ['idAprendiz', 'idFicha'],
      fetchData: fetchAprendizIfNotLoaded,
    },
    // Puedes agregar más rutas aquí que usen la misma lógica
  ];

  /**
   * Función auxiliar que convierte los valores capturados de una ruta (por una expresión regular)
   * en un objeto con nombres de claves definidos por el array `keys`.
   *
   * @param {string[]} keys - Nombres de los parámetros que se asignarán a los valores capturados.
   * @returns {(match: RegExpMatchArray) => Object<string, string>} Una función que toma el resultado del match
   * y devuelve un objeto clave-valor.
   *
   * @example
   * const match = ['/fichas/7/aprendiz/6/empresa', '7','6'];
   * const parse = mapParam(['idFicha', 'idAprendiz']);
   * console.log(parse(match)); // { idFicha: '7', idAprendiz: '6' }
   */
  const mapParam =
    (keys) =>
    ([_, ...items]) =>
      Object.fromEntries(keys.map((key, i) => [key, items[i]]));

  useEffect(() => {
    const path = location.pathname;

    for (const route of routes) {
      const match = path.match(route.pattern);

      if (match) {
        const resultados = mapParam(route.param)(match);
        route.fetchData(resultados);
        break; // Detiene la búsqueda tras encontrar la primera coincidencia
      }
    }
  }, [location.pathname]);
};
