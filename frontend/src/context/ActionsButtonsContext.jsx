import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

/**
 * `ActionsButtonsContext`
 *
 * Contexto para gestionar el estado de los botones de acción en los componentes.
 * Permite a los componentes registrar nuevos botones o actualizar toda la lista de botones.
 */
const ActionsButtonsContext = createContext();

/**
 * `ActionsButtonsProvider`
 *
 * Proveedor del contexto `ActionsButtonsContext`. Se encarga de gestionar el array de botones de acción
 * y proporciona métodos para agregar o reemplazar los botones.
 *
 * @param {Object} props - Props del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto de botones de acción.
 *
 * @returns {JSX.Element} - Proveedor de contexto para la gestión de botones de acción.
 */
export const ActionsButtonsProvider = ({ children }) => {
  //stado para almacenar la lista de botones de acción
  const [actionsButtons, setActionsButtons] = useState([]);

  /**
   * `addActionsButton`
   *
   * Agrega un nuevo botón de acción a la lista actual.
   *
   * @param {Object} button - Objeto de configuración del botón.
   * @param {JSX.Element} button.icon - Ícono que se mostrará en el botón.
   * @param {string} button.color - Color del botón.
   * @param {string} button.position - Posición en la que se debe mostrar el botón.
   * @param {Function} button.action - Función que se ejecutará al hacer clic en el botón.
   * @param {string} button.tooltip - Texto del tooltip que se mostrará al pasar el cursor.
   */
  const addActionsButton = useCallback(({ buttonConfig }) => {
    setActionsButtons((prevActionsButtons) => [
      ...prevActionsButtons,
      buttonConfig,
    ]);
  }, []);

  /**
   * `updateActionsButtons`
   *
   * Reemplaza toda la lista actual de botones con un nuevo array.
   *
   * @param {Array<Object>} buttonsArray - Array de objetos de configuración de botones.
   */
  const updateActionsButtons = useCallback((buttonsArray) => {
    setActionsButtons(buttonsArray);
  }, []);

  //Valor del contexto memorizado para evitar re-renderizados innecesarios
  const contextValue = useMemo(
    () => ({ actionsButtons, addActionsButton, updateActionsButtons }),
    [actionsButtons, addActionsButton, updateActionsButtons]
  );

  return (
    <ActionsButtonsContext.Provider value={contextValue}>
      {children}
    </ActionsButtonsContext.Provider>
  );
};

/**
 * `useActionsButtonsContext`
 *
 * Hook personalizado para acceder al contexto `ActionsButtonsContext`.
 * Debe utilizarse dentro de un componente envuelto por `ActionsButtonsProvider`.
 *
 * @returns {Object} - Información y funciones del contexto de botones de acción.
 * @property {Array<Object>} actionsButtons - Lista actual de botones de acción.
 * @property {Function} addActionsButton - Función para agregar un botón a la lista.
 * @property {Function} updateActionsButtons - Función para reemplazar la lista de botones.
 * @throws {Error} - Lanza un error si se usa fuera del `ActionsButtonsProvider`.
 */
export const useActionsButtonsContext = () => {
  const context = useContext(ActionsButtonsContext);
  if (!context) {
    throw new Error(
      'useActionsButtonsContext debe estar dentro de ActionsButtonsProvider'
    );
  }
  return context;
};
