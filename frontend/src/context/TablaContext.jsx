import {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';

/**
 * `TablaContext`
 *
 * Contexto para gestionar la vista de la tabla en la aplicación.
 * Permite controlar si la tabla se muestra en formato lista o cuadrícula.
 */
const TablaContext = createContext();

/**
 * `TablaProvider`
 *
 * Proveedor de contexto que gestiona la vista de la tabla (lista o cuadrícula).
 * Permite alternar entre las dos vistas mediante una función.
 *
 * @param {Object} props - Props del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto.
 *
 * @returns {JSX.Element} - Proveedor de contexto para la tabla.
 */
export const TablaProvider = ({ children }) => {

  //Estado que indica si la tabla se muestra en vista de lista o cuadrícula.
  //Valor inicial: `true` (vista de lista).
  const [isTablaList, setTablaList] = useState(true);

  /**
   * Alterna entre la vista de lista y cuadrícula.
   * 
   * @returns {void}
   */
  const switchTabla = useCallback(() => {
    setTablaList((visible) => !visible);
  }, []);

  //Valor del contexto memorizado para evitar re-renderizados innecesarios.
  const contextValue = useMemo(
    () => ({
      isTablaList,
      switchTabla,
    }),
    [isTablaList, switchTabla]
  );

  return (
    <TablaContext.Provider value={contextValue}>
      {children}
    </TablaContext.Provider>
  );
};

/**
 * `useTabla`
 *
 * Hook para acceder al contexto de la tabla.
 * Debe ser utilizado dentro de un componente envuelto en `TablaProvider`.
 *
 * @returns {Object} Estado y funciones del contexto de la tabla.
 * @property {boolean} isTablaList - Indica si la tabla se muestra en vista de lista (`true`) o en vista de cuadrícula (`false`).
 * @property {Function} switchTabla - Función para alternar entre vista de lista y vista de cuadrícula.
 * @throws {Error} Lanza un error si se usa fuera de `TablaProvider`.
 */
export const useTabla = () => {
  const context = useContext(TablaContext);
  if (!context) {
    throw new Error('useTabla debe estar dentro del proveedor');
  }
  return context;
};
