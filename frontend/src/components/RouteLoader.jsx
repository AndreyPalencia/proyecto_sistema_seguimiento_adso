import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoadDataOnRouteMatch } from '../hook/useLoadDataOnRouteMatch';

/**
 * `RouteLoader`
 * 
 * Componente funcional que ejecuta la lógica de carga de datos según la ruta actual.
 *
 * Este componente utiliza el hook `useLoadDataOnRouteMatch` para evaluar si la ruta
 * actual del navegador coincide con algún patrón definido, y si es así, se encarga
 * de disparar la función correspondiente para cargar los datos necesarios.
 *
 * Este comportamiento es útil en casos como:
 * - Acceso directo a rutas profundas (ej. recarga del navegador).
 * - Necesidad de pre-cargar datos al ingresar a rutas protegidas o internas.
 *
 * Este componente no renderiza ningún elemento visual. Solo actúa como observador
 * del cambio de ruta y ejecuta lógica cuando es necesario.
 *
 * Recomendado para ser usado dentro de layouts principales o rutas protegidas:
 *
 * @example
 * ```jsx
 * <ProtectedRoute>
 *   <DashboardLayout>
 *     <RouteLoader />
 *     <Outlet />
 *   </DashboardLayout>
 * </ProtectedRoute>
 * ```
 *
 * @returns {null} Este componente no tiene salida visual.
 */
const RouteLoader = () => {
  const location = useLocation();

  useLoadDataOnRouteMatch();

  useEffect(() => {
    // console.log('Ruta actual:', location.pathname);
  }, [location.pathname]);

  return null;
};

export default RouteLoader;
