import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { userRol } from '../services/Auth';

/**
 * `AuthContext`
 *
 * Contexto para gestionar el estado de autenticación del usuario, incluyendo su rol y ID.
 * Permite acceder a la información del usuario (rol, ID) y realizar la validación del rol del usuario.
 */
const AuthContext = createContext();

/**
 * `AuthProvider`
 *
 * Proveedor del contexto de autenticación. Este componente se encarga de obtener y gestionar
 * el rol y ID del usuario, y proporciona métodos para acceder a esta información desde otros componentes.
 *
 * @param {Object} props - Props del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto de autenticación.
 *
 * @returns {JSX.Element} - Proveedor de contexto para la autenticación del usuario.
 */
export const AuthProvider = ({ children }) => {
  //Estado para almacenar el rol del usuario
  const [roleUsuario, setRoleUsuario] = useState(null);

  //Estado para almacenar el ID del usuario
  const [idUsuario, setIdUsuario] = useState(null);
  //Estado de carga, útil para mostrar indicadores mientras se obtiene el rol del usuario
  const [loading, setLoading] = useState(true);

  /**
   * Función para validar al usuario y obtener su rol e ID.
   * Se realiza una llamada al servicio `userRol` para obtener la información.
   *
   * @returns {Object} Resultado de la validación con el rol e ID del usuario, o un error si la validación falla.
   * @property {boolean} success - Indica si la validación fue exitosa.
   * @property {string|null} rol - Rol del usuario (null si no está autenticado).
   * @property {number|null} idUsuario - ID del usuario (null si no está autenticado).
   * @property {Error|null} error - Error en caso de fallo.
   */
  const validarUsuario = useCallback(async () => {
    try {
      const usuario = await userRol();
      //console.log(usuario);
      setRoleUsuario(usuario.rol);
      setIdUsuario(usuario.idUsuario);
      setLoading(false);
      return { success: true, rol: usuario.rol, idUsuario: usuario.idUsuario };
    } catch (error) {
      setRoleUsuario(null);
      setIdUsuario(null);
      console.error('Error al obtener el rol del usuario:', error);
      return { success: false, error: error };
    } finally {
      setLoading(false);
    }
  }, []);

  // fecto para validar el usuario cuando se carge el componente
  useEffect(() => {
    validarUsuario();
  }, []);

  //Valor del contexto memorizado para evitar re-renderizados innecesarios.
  const valueContext = useMemo(
    () => ({ roleUsuario, idUsuario, loading, validarUsuario }),
    [roleUsuario, loading, validarUsuario, idUsuario]
  );

  return (
    <AuthContext.Provider value={valueContext}>{children}</AuthContext.Provider>
  );
};

/**
 * `useAuth`
 *
 * Hook para acceder al contexto de autenticación. Debe ser utilizado dentro de un componente
 * envuelto por `AuthProvider`.
 *
 * @returns {Object} Información del usuario y funciones de autenticación.
 * @property {string|null} roleUsuario - Rol del usuario (null si no está autenticado).
 * @property {number|null} idUsuario - ID del usuario (null si no está autenticado).
 * @property {boolean} loading - Estado de carga mientras se obtiene la información del usuario.
 * @property {Function} validarUsuario - Función para validar y obtener el rol del usuario.
 * @throws {Error} Lanza un error si se usa fuera del contexto `AuthProvider`.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado en AuthProvider');
  }
  return context;
};
