import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { getAprendizByFichas } from '../services/FichaAprendiz';

/**
 * Contexto para gestionar la lista de aprendices y el aprendiz seleccionado.
 * Permite a los componentes acceder a la lista de aprendices y al aprendiz seleccionado.
 *
 */
const AprendicesContext = createContext();

/**
 * Proveedor de contexto para los aprendices.
 *
 * @param {React.ReactNode} children - Componentes hijos que tienen acceso al contexto.
 * @returns {JSX.Element} El proveedor de contexto que envuelve a los hijos.
 */
export const AprendicesProvider = ({ children }) => {
  const [aprendices, setAprendices] = useState([]);
  const [aprendizSeleccionado, setAprendizSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtiene los aprendices asociados a una ficha específica.
   *
   * @param {number} idFicha - ID de la ficha para obtener los aprendices.
   * @returns {Promise<void>} Promesa que se resuelve cuando se obtiene la lista de aprendices.
   */
  const obtenerAprendicesByFicha = async (idFicha) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAprendizByFichas(idFicha);
      const aprendices = response.data;
      const results = aprendices.map(({ Usuario, ...rest }) => ({
        idUsuario:Usuario.idUsuario, 
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
      setAprendices(results);
    } catch (error) {
      setError(error || 'Error al obtener los aprendices');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarAprendiz = useCallback(
    (id) => {
      const aprendiz = aprendices.find((a) => a?.idUsuario === parseInt(id));
      //setAprendizSeleccionado(aprendiz);
     // console.log(aprendiz, id, 'prueba')
      return aprendiz || null;
    },
    [aprendices]
  );

  /**
   * Selecciona un aprendiz desde la lista, usando su `idUsuario`.
   *
   * Permite especificar si se debe buscar en `aprendiz` o en `infoFichaAprendiz`.
   * Además de guardarlo en el estado, devuelve el aprendiz encontrado.
   *
   * @param {number} id - ID del usuario (aprendiz) a seleccionar.
   * @param {'aprendiz'|'infoFichaAprendiz'} tipo - Tipo de objeto dentro del aprendiz (por defecto: 'aprendiz').
   * @returns {Object|undefined} El aprendiz encontrado o `undefined` si no existe.
   */
  const seleccionarAprendizByPropiedad = useCallback(
    (id, tipo = 'aprendiz') => {
      const aprendiz = aprendices.find(
        (a) => a[tipo]?.idUsuario === parseInt(id)
      );
      //setAprendizSeleccionado(aprendiz);
      //console.log(aprendiz)
      return aprendiz[tipo] || null;
    },
    [aprendices]
  );

  /**
   * Función que devuelve una lista de objetos con solo la propiedad `aprendiz`.
   *
   * @returns {Array<Object>} - Lista de objetos `aprendiz`.
   */
  const aprendicesInfo = useCallback(() => {
    return aprendices.map((item) => item.aprendiz); // Devuelve solo los valores de `aprendiz`
  }, [aprendices]);

  /**
   * Función que devuelve una lista de objetos con solo la propiedad `infoFichaAprendiz`.
   *
   * @returns {Array<Object>} - Lista de objetos `infoFichaAprendiz`.
   */
  const infoFichaAprendiz = useCallback(() => {
    return aprendices.map((item) => item.infoFichaAprendiz); // Devuelve solo los valores de `infoFichaAprendiz`
  }, [aprendices]);

  /**
   * Función que actualiza la información dentro de una propiedad específica (por ejemplo, 'infoFichaAprendiz' o 'aprendiz')
   * de un aprendiz en el contexto, identificándolo por su `idAprendiz`.
   *
   * Esta función permite modificar datos anidados dentro de cada objeto aprendiz sin sobrescribir todo el objeto raíz.
   *
   * @function actualizarPropiedadDeAprendiz
   * @param {string|number} idAprendiz - ID único del aprendiz que se desea actualizar.
   * @param {string} [propiedad='aprendiz'] - Nombre de la propiedad del aprendiz que se quiere actualizar.
   *        Puede ser 'infoFichaAprendiz' o 'aprendiz', dependiendo de la estructura del contexto.
   * @param {Object} nuevaInfo - Objeto con las nuevas propiedades que se desean mezclar (merge) dentro de la propiedad especificada.
   *
   * @example
   * actualizarPropiedadDeAprendiz('234', 'infoFichaAprendiz', {
   *   alternativa: 'Pasantía',
   *   jefeInmediato: 'Ana Rodríguez'
   * });
   */
  const actualizarPropiedadDeAprendiz = (
    idAprendiz,
    nuevaInfo,
    propiedad = 'aprendiz'
  ) => {
    setAprendices((prevAprendices) => {

      const existe = prevAprendices.some(
        (a) => a[propiedad]?.idAprendiz === parseInt(idAprendiz)
      );

      if (!existe) {
        console.warn(
          `No se encontró el aprendiz con id ${idAprendiz} en la propiedad "${propiedad}"`
        );
      }

      return prevAprendices.map((a) =>
        a[propiedad]?.idAprendiz === idAprendiz
          ? {
              ...a,
              [propiedad]: {
                ...a[propiedad],
                ...nuevaInfo,
              },
            }
          : a
      );
    });
  };

  const contextValue = useMemo(
    () => ({
      aprendices,
      aprendizSeleccionado,
      loading,
      error,
      obtenerAprendicesByFicha,
      seleccionarAprendiz,
      seleccionarAprendizByPropiedad,
      aprendicesInfo,
      infoFichaAprendiz,
      actualizarPropiedadDeAprendiz, // add this
    }),
    [
      aprendices,
      aprendizSeleccionado,
      loading,
      error,
      obtenerAprendicesByFicha,
      seleccionarAprendiz,
      seleccionarAprendizByPropiedad,
      aprendicesInfo,
      infoFichaAprendiz,
    ]
  );

  return (
    <AprendicesContext.Provider value={contextValue}>
      {children}
    </AprendicesContext.Provider>
  );
};

/**
 * `useAprendices`
 *
 * Hook personalizado para consumir el contexto de aprendices. Este hook debe ser
 * utilizado dentro de un componente que esté envuelto por `AprendicesProvider`.
 *
 * @returns {Object} El valor del contexto, que contiene las propiedades y funciones disponibles en el `AprendicesContext`.
 *
 * @property {Array<Object>} aprendices - Lista de aprendices obtenidos de la base de datos o servicio.
 * @property {Object|null} aprendizSeleccionado - El aprendiz actualmente seleccionado (si lo hay), o `null` si no hay ninguno.
 * @property {boolean} loading - Indica si los datos de los aprendices están siendo cargados (`true`) o si ya se han cargado (`false`).
 * @property {Error|string|null} error - Contiene cualquier error que ocurra durante la carga de los aprendices, o `null` si no hay errores.
 * @property {Function} obtenerAprendicesByFicha - Función que obtiene los aprendices asociados a una ficha específica, requiere un `idFicha`.
 * @property {Function} seleccionarAprendiz - Función que selecciona un aprendiz dinámicamente según el tipo (`'aprendiz'` o `'infoFichaAprendiz'`), guarda el aprendiz y lo retorna.
 * @property {Function} aprendicesInfo - Función que devuelve una lista de objetos con solo la propiedad `aprendiz` de cada item.
 * @property {Function} infoFichaAprendiz - Función que devuelve una lista de objetos con solo la propiedad `infoFichaAprendiz` de cada item.
 * @property {Function} actualizarPropiedadDeAprendiz - Función que actualiza una propiedad específica del objeto aprendiz.
 *
 * @throws {Error} Si se intenta usar este hook fuera del proveedor de contexto.
 */
export const useAprendices = () => {
  const context = useContext(AprendicesContext);
  if (!context) {
    throw new Error(
      'useAprendices debe usarse dentro de un AprendicesProvider'
    );
  }
  return context;
};
