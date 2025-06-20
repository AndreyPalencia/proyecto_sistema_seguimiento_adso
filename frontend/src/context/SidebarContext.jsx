import {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';

/**
 * `SidebarContext`
 *
 * Contexto para gestionar la visibilidad del sidebar y su estado.
 * Proporciona funciones para alternar la visibilidad, gestionar la pila de vistas/sidebar,
 * y manejar los IDs seleccionados.
 */
const SidebarContext = createContext();

/**
 * `SidebarProvider`
 *
 * Proveedor del contexto del sidebar. Encapsula el estado y las funciones relacionadas con el sidebar.
 * @param {Object} props - Props del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto.
 *
 * @returns {JSX.Element} - Proveedor de contexto para la tabla.
 */
export const SidebarProvider = ({ children }) => {
  //Estado que indica si el sidebar está visible o no. Valor inicial: `true` (visible).
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  //Estado que almacena la pila de vistas del sidebar.
  const [sidebarStack, setSidebarStack] = useState(['main']);
  //Estado que almacena el id de referencia seleccionado.
  const [selectedIds, setSelectedIds] = useState({});

  /**
   * Función que alternar la visibilidad del sidebar.
   *
   * @returns {void}
   */
  const toggleSidebar = useCallback(() => {
    setSidebarVisible((visible) => !visible);
  }, []);

  /**
   * Función que agrega una nueva vista al stack del sidebar.
   * Valida que la vista no exista ya en el stack para evitar duplicados.
   * Si la vista es un array, se agrega cada elemento al stack.
   * Si no, se agrega la vista directamente.
   *
   * @param {string|Array} view - Vista o array de vistas a agregar
   * @returns {void}
   */
  const pushSidebarView = useCallback((view) => {
    setSidebarStack((prev) => {
      // Asegurar que prev sea un array
      const currentStack = Array.isArray(prev) ? prev : [prev];

      // Si view es un array, procesar cada elemento
      if (Array.isArray(view)) {
        const newViews = view.filter((v) => !currentStack.includes(v));
        if (newViews.length === 0) {
          console.warn('Todas las vistas ya existen en el stack:', view);
          return currentStack;
        }
        return [...currentStack, ...newViews];
      }

      // Si es una vista simple, verificar que no exista
      if (currentStack.includes(view)) {
        console.warn(`La vista '${view}' ya existe en el stack:`, currentStack);
        return currentStack;
      }

      // Validar que la vista no sea vacía o inválida
      if (!view || typeof view !== 'string') {
        console.warn('Vista inválida:', view);
        return currentStack;
      }

      return [...currentStack, view];
    });
  }, []);

  /**
   * Función que elimina la última vista del stack del sidebar.
   * Si el stack tiene más de un elemento, se elimina el último.
   * Si no, se establece el stack a 'main'.
   *
   * @return {void}
   */
  const popSidebarView = useCallback(() => {
    setSidebarStack((prev) => {
      const currentStack = Array.isArray(prev) ? prev : [prev];

      // Mantener al menos 'main' en el stack
      if (currentStack.length > 1) {
        return currentStack.slice(0, -1);
      } else {
        console.warn('No se puede quitar la vista principal del stack');
        return ['main'];
      }
    });
  }, []);

  /**
   * Función que maneja los ids de referencia seleccionados.
   * Actualiza el estado `selectedIds` con el nuevo valor para la clave dada.
   *
   * @param {string} key - Clave del id de referencia.
   * @param {string} value - Nuevo valor del id de referencia.
   *
   * @return {void}
   */
  const setIds = useCallback((key, value) => {
    //console.log('🏷️ setIds llamado:', { key, value });
    setSelectedIds((prev) => {
      const newState = {
        ...prev,
        [key]: value,
      };
      //console.log('🏷️ selectedIds anterior:', prev);
      //console.log('🏷️ selectedIds nuevo:', newState);
      return newState;
    });
  }, []);
  /**
   * Función que obtiene el id de referencia seleccionado por clave
   * y lo elimina del objeto de ids seleccionados.
   *
   * @param {string} key - Clave del id de referencia.
   *
   * @return {void}
   */
  const clearId = useCallback((key) => {
    setSelectedIds((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  /**
   * Función que elimina todos los ids de referencia seleccionados.
   * Se utiliza para limpiar el estado de los ids seleccionados.
   *
   * @return {void}
   */
  const clearAllIds = useCallback(() => {
    setSelectedIds({});
  }, []);

  /**
   * Función que obtiene un array de ids de referencia seleccionados
   * y los elimina del objeto de ids seleccionados.
   *
   * @param {Array} key - Array de claves de ids de referencia.
   *
   * @return {void}
   */
  const clearIds = useCallback((key = []) => {
    setSelectedIds((prev) => {
      const newIds = { ...prev };
      key.forEach((k) => {
        delete newIds[k];
      });
      return newIds;
    });
  }, []);

  /**
   * Función que restablece el stack del sidebar a su vista principal ('main').
   *
   * @return {void}
   */
  const resetSidebarView = useCallback(() => {
    setSidebarStack(['main']);
    clearAllIds(); // Limpiar los IDs cuando se reinicia el sidebar
  }, [clearAllIds]);

  // Funciones de utilidad nuevas
  /**
   * Verifica si una vista existe en el stack
   * @param {string} view - Vista a verificar
   * @returns {boolean} - True si la vista existe en el stack
   */
  const isViewInStack = useCallback(
    (view) => {
      return sidebarStack.includes(view);
    },
    [sidebarStack]
  );

  /**
   * Obtiene la vista actual (última en el stack)
   * @returns {string} - Vista actual
   */
  const getCurrentView = useCallback(() => {
    return sidebarStack[sidebarStack.length - 1] || 'main';
  }, [sidebarStack]);

  /**
   * Obtiene la vista anterior (penúltima en el stack)
   * @returns {string} - Vista anterior o 'main' si no hay anterior
   */
  const getPreviousView = useCallback(() => {
    return sidebarStack[sidebarStack.length - 2] || 'main';
  }, [sidebarStack]);

  /**
   * Obtiene la profundidad del stack
   * @returns {number} - Número de vistas en el stack
   */
  const getStackDepth = useCallback(() => {
    return sidebarStack.length;
  }, [sidebarStack]);

  /**
   * Navega a una vista específica de manera inteligente
   * - Si no existe, la agrega
   * - Si existe pero no es la actual, navega hacia atrás hasta ella
   * - Si es la actual, no hace nada
   * @param {string} targetView - Vista objetivo
   */
  const navigateToView = useCallback(
    (targetView) => {
      const currentIndex = sidebarStack.indexOf(targetView);

      if (currentIndex === -1) {
        // La vista no está en el stack, agregarla
        pushSidebarView(targetView);
      } else if (currentIndex < sidebarStack.length - 1) {
        // La vista está en el stack pero no es la actual, navegar hacia atrás hasta ella
        const viewsToRemove = sidebarStack.length - 1 - currentIndex;
        setSidebarStack((prev) => prev.slice(0, currentIndex + 1));
      }
      // Si es la vista actual, no hacer nada
    },
    [sidebarStack, pushSidebarView]
  );

  const contextValue = useMemo(
    () => ({
      isSidebarVisible,
      toggleSidebar,
      sidebarStack,
      pushSidebarView,
      popSidebarView,
      resetSidebarView,
      selectedIds,
      setIds,
      clearId,
      clearIds,
      clearAllIds,
      // Nuevas funciones de utilidad
      isViewInStack,
      getCurrentView,
      getPreviousView,
      getStackDepth,
      navigateToView,
    }),
    [
      isSidebarVisible,
      toggleSidebar,
      sidebarStack,
      pushSidebarView,
      popSidebarView,
      resetSidebarView,
      selectedIds,
      setIds,
      clearId,
      clearIds,
      clearAllIds,
      isViewInStack,
      getCurrentView,
      getPreviousView,
      getStackDepth,
      navigateToView,
    ]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

/**
 * `useSidebar`
 *
 * Hook personalizado para acceder al contexto de visibilidad del sidebar.
 * Este hook debe ser utilizado **únicamente** dentro de un componente envuelto
 * en `SidebarProvider`. Si se utiliza fuera de dicho proveedor, lanzará un error.
 *
 * @returns {Object} Estado y funciones del contexto del sidebar.
 * @property {boolean} isSidebarVisible - Determina si el sidebar está visible (`true`) o no (`false`).
 * @property {Function} toggleSidebar - Función para alternar la visibilidad del sidebar.
 * @property {Array} sidebarStack - Array que representa la pila de vistas del sidebar.
 * @property {Function} pushSidebarView - Función para agregar una nueva vista al stack del sidebar.
 * @property {Function} popSidebarView - Función para eliminar la última vista del stack del sidebar.
 * @property {Function} resetSidebarView - Función para restablecer el stack del sidebar a su vista principal ('main').
 * @property {Object} selectedIds - Objeto que almacena los IDs de referencia seleccionados.
 * @property {Function} setIds - Función para establecer un ID de referencia seleccionado.
 * @property {Function} clearId - Función para eliminar un ID de referencia seleccionado.
 * @property {Function} clearIds - Función para eliminar varios IDs de referencia seleccionados.
 * @property {Function} clearAllIds - Función para eliminar todos los IDs de referencia seleccionados.
 * @property {Function} isViewInStack - Función para verificar si una vista existe en el stack.
 * @property {Function} getCurrentView - Función para obtener la vista actual.
 * @property {Function} getPreviousView - Función para obtener la vista anterior.
 * @property {Function} getStackDepth - Función para obtener la profundidad del stack.
 * @property {Function} navigateToView - Función para navegar a una vista específica de manera inteligente.
 * @throws {Error} Lanza un error si se usa fuera de `SidebarProvider`.
 */

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      'useSidebar debe estar dentro del proveedor SidebarProvider'
    );
  }
  return context;
};
