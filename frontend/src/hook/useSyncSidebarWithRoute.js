import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';

/**
 * Rutas del sidebar para sincronizar con la URL.
 * Cada ruta tiene un patrón, una vista asociada y una acción de sidebar.
 */
const sidebarRoutes = [
  // {
  //   pattern: /\/admin\/rol\/instructor\/(\d+)\/fichas\/?$/,
  //   view: 'mainInstructor',
  //   idType: ['idInstructor'],
  //   sidebarAction: 'push',
  // },

  {
    // Coincide con /ficha/:idFicha/aprendiz/:idAprendiz/info
    pattern: /\/ficha\/(\d+)\/aprendiz\/(\d+)\/([^/]+)\/?$/,
    view: 'ficha',
    idType: ['idFicha', 'idAprendiz'],
    sidebarAction: 'push',
  },
  {
    // Coincide con /fichas/:idFicha/:parametro
    pattern: /\/ficha\/(\d+)\/([^/]+)\/?$/,
    view: 'ficha',
    idType: ['idFicha'],
    sidebarAction: 'push',
  },
  {
    // Coincide con /fichas
    pattern: /\/fichas\/?$/,
    sidebarAction: 'reset',
  },

  {
    // Coincide con /fichas
    pattern: /\/admin\/usuarios\/?$/,
    sidebarAction: 'reset',
  },
];

/**
 * Hook `useSyncSidebarWithRoute` personalizado para sincronizar el estado del sidebar
 * con la ruta actual de la aplicación.
 *
 * Este hook escucha los cambios en la ruta y actualiza el estado del sidebar en consecuencia.
 * Actualiza la vista activa del sidebar y empuja o saca vistas basadas en la ruta actual.
 * Además, gestiona los IDs y asegura que el estado del sidebar esté sincronizado con la ruta.
 *
 * @returns {void} Este hook no devuelve nada. Se utiliza para efectos secundarios.
 */
export const useSyncSidebarWithRoute = () => {
  const location = useLocation();
  const { setIds, pushSidebarView, popSidebarView, resetSidebarView } =
    useSidebar();

  // Ref para hacer seguimiento de la vista anterior y el idHash
  const prevRef = useRef({
    view: null,
    idHash: '',
  });

  // Función para manejar la acción del sidebar
  const handleSidebarAction = (action, route) => {
    switch (action) {
      case 'push':
        if (route.view) pushSidebarView(route.view);
        break;
      case 'pop':
        popSidebarView();
        break;
      case 'reset':
        resetSidebarView();
        break;
      default:
        break;
    }
  };

  // Función para manejar el match de cada ruta
  const handleRouteMatch = (route, idTypes) => {
    // Actualizar el estado de los IDs
    for (const [key, value] of Object.entries(idTypes)) {
      setIds(key, value);
    }

    // Llamar a la acción del sidebar
    handleSidebarAction(route.sidebarAction, route);
  };

  useEffect(() => {
    const path = location.pathname;

    for (const route of sidebarRoutes) {
      const match = path.match(route.pattern);
      // Si no hay coincidencia con la ruta, continuar con la siguiente iteración
      if (!match) continue;

      // Extraer los IDs de la ruta
      const idTypes = route.idType
        ? route.idType.reduce((acc, idType, index) => {
            acc[idType] = match[index + 1];
            return acc;
          }, {})
        : {};

      // Crear un hash de los IDs para comparar con la vista anterior
      const idHash = idTypes
        ? Object.entries(idTypes)
            .map(([key, value]) => `${key}:${value}`)
            .join(',')
        : '';

      const prev = prevRef.current;

      // Si la vista y los IDs actuales son iguales a los anteriores, no hacer nada
      // Esto evita que el sidebar se actualice innecesariamente
      if (prev.view === route.view && prev.idHash === idHash) return;

      // Guardar vista e IDs actuales
      prevRef.current = {
        view: route.view || null,
        idHash,
      };

      // Llamar a la función para manejar la coincidencia de la ruta
      handleRouteMatch(route, idTypes);

      break; // Ya encontramos una ruta que hace match
    }
  }, [location.pathname]); // Se ejecuta cuando cambie la ruta
};
