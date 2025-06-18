import {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';

/**
 * `NumberNotificationsContext`
 *
 * Contexto para manejar el número de notificaciones sin leer en la aplicación.
 * Provee estado y funciones para compartir el valor de la cantidad de
 * notificaciones sin leer que tiene un usuario.
 */
const NumberNotificationsContext = createContext();

/**
 * `NumberNotificationsProvider`
 *
 * Proveedor del contexto para compartir el valor de notificaciones sin leer.
 *
 * @param {Object} props - Props del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto.
 *
 * @returns {JSX.Element} - Proveedor de contexto para las notificaciones sin leer.
 */
export const NumberNotificationsProvider = ({ children }) => {
  //Estado que indica el número de notificaciones sin leer.
  //Valor inicial: 0 (sin notificaciones).
  const [numberNotifications, setNumberNotifications] = useState(0);

  /**
   * Actualiza el valor de notificaciones sin leer.
   * @param {number} newValueNotifications - Nuevo valor para el número de notificaciones sin leer.
   * @returns {void}
   */
  const handleNumberNotifications = useCallback((newValueNotifications) => {
    setNumberNotifications(newValueNotifications);
  }, []);

  const incrementNumberNotifications = useCallback(() => {
    setNumberNotifications((prev) => prev + 1);
  }, []);

  // Valor del contexto memorizado para evitar re-renderizados innecesarios.
  const contextValue = useMemo(
    () => ({
      numberNotifications,
      handleNumberNotifications,
      incrementNumberNotifications,
    }),
    [
      numberNotifications,
      handleNumberNotifications,
      incrementNumberNotifications,
    ]
  );

  return (
    <NumberNotificationsContext.Provider value={contextValue}>
      {children}
    </NumberNotificationsContext.Provider>
  );
};

/**
 * `useNumberNotifications`
 *
 * Hook para acceder al contexto de número de notificaciones.
 * Debe ser utilizado dentro de un componente envuelto en `NumberNotificationsProvider`.
 *
 * @returns {Object} Estado y funciones del contexto de número de notificaciones.
 * @property {number} numberNotifications - Número de notificaciones sin leer.
 * @property {Function} handleNumberNotifications - Función para actualizar el valor de notificaciones sin leer.
 * @throws {Error} Lanza un error si se usa fuera de `NumberNotifications`.
 */
export const useNumberNotifications = () => {
  const context = useContext(NumberNotificationsContext);
  if (!context) {
    throw new Error(
      'useNumberNotifications no puede ser usado fuera de NumberNotificationsProvider'
    );
  }
  return context;
};
