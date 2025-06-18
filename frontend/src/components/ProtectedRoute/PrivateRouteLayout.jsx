import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LazyLoader from '../Feedback/LazyLoader';
import RouteLoader from '../RouteLoader';

/**
 * `PrivateRouteLayout`
 *
 * Componente que protege las rutas privadas de la aplicación. Asegura que el usuario
 * tenga el rol adecuado para acceder a la ruta solicitada. Si no está autenticado,
 * lo redirige a la página de login, y si no tiene el rol adecuado, lo redirige a una página
 * de "no autorizado".
 *
 * Utiliza la información del contexto de autenticación (como el rol del usuario) para
 * determinar si el usuario tiene permiso para acceder a una ruta específica. También
 * maneja el estado de carga mientras se obtiene la información de autenticación.
 *
 * También se encarga de llamar al componente `RouteLoader`, que ejecuta un hook que
 * verifica la ruta actual y carga información vital para el componente que se va a renderizar
 * con esa ruta. Este hook es especialmente útil para manejar la carga de datos basados
 * en rutas dinámicas.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Contenido de la ruta protegida que solo
 * estará disponible si el usuario tiene acceso.
 * @param {Array<string>} props.allowedRoles - Lista de roles permitidos para acceder
 * a la ruta. Si el rol del usuario no está en esta lista, se lo redirige a una página
 * de "no autorizado".
 *
 * @returns {React.ReactNode} - Si el usuario está autenticado y tiene el rol adecuado,
 * devuelve el contenido de la ruta protegida. Si el usuario no está autenticado,
 * lo redirige a la página de login. Si no tiene el rol adecuado, lo redirige a la página
 * de "no autorizado".
 *
 * @example
 * // Ejemplo de uso:
 * <PrivateRouteLayout allowedRoles={['admin', 'aprendiz']}>
 *   <DashboardLayout />
 * </PrivateRouteLayout>
 */

const PrivateRouteLayout = ({ children, allowedRoles }) => {
  const { roleUsuario, idUsuario, loading } = useAuth();
  const location = useLocation(); // Para obtener la ubicación actual y redirigir después del login

  // Mientras se está cargando el estado de autenticación, mostramos un loader
  if (loading) return <LazyLoader />; // Aquí puedes poner un mensaje de carga si prefieres

  // console.log('rol', roleUsuario, 'estado carga', loading )
  // Si no hay rol de usuario (no autenticado), redirige al login
  if (!roleUsuario) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Si el rol no está en la lista de roles permitidos, redirige a "no autorizado"
  if (!allowedRoles.includes(roleUsuario)) {
    return (
      <Navigate to={`/${idUsuario}/${roleUsuario}/no-autorizado`} replace />
    );
  }

  // Si el usuario tiene el rol adecuado, renderiza el contenido de la ruta protegida
  return (
    <>
      {children}
      {<RouteLoader />}
    </>
  );
};

export default PrivateRouteLayout;
