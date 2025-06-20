import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';

/**
 * Rutas del sidebar para sincronizar con la URL.
 *
 * Ejemplo de cómo funciona la extracción de IDs:
 *
 * Ruta: /admin/rol/instructor/84/ficha/53/aprendices
 * Pattern: /^\/admin\/rol\/instructor\/(\d+)\/ficha\/(\d+)\/(info|aprendices|calendario-ficha)\/?$/
 * Match: ['whole_match', '84', '53', 'aprendices']
 * idType: ['idInstructorAdmin', 'idFicha']
 * Resultado: { idInstructorAdmin: '84', idFicha: '53' }
 */
const sidebarRoutes = [
  // --- Vista admin ---
  {
    pattern: /^\/admin\/usuarios\/?$/,
    views: ['main'],
    sidebarAction: 'set',
  },

  // Ruta específica para fichas del instructor
  {
    pattern: /^\/admin\/rol\/instructor\/(\d+)\/fichas\/?$/,
    views: ['main', 'mainInstructor'],
    idType: ['idInstructorAdmin'],
    sidebarAction: 'set',
  },

  {
    pattern:
      /^\/admin\/rol\/instructor\/(\d+)\/(reporte-general-ficha|calendario-fichas)\/?$/,
    views: ['main', 'mainInstructor'],
    idType: ['idInstructorAdmin'],
    sidebarAction: 'set',
  },

  {
    pattern:
      /^\/admin\/rol\/instructor\/(\d+)\/ficha\/(\d+)\/(info|aprendices|calendario-ficha)\/?$/,
    views: ['main', 'mainInstructor', 'fichaInstructor'],
    idType: ['idInstructorAdmin', 'idFicha'],
    sidebarAction: 'set',
  },

  {
    pattern:
      /^\/admin\/rol\/instructor\/(\d+)\/ficha\/(\d+)\/aprendiz\/(\d+)\/(info|empresa|observaciones|seguimiento|reportes-gfpi-f)\/?$/,
    views: ['main', 'mainInstructor', 'fichaInstructor'],
    idType: ['idInstructorAdmin', 'idFicha', 'idAprendiz'],
    sidebarAction: 'set',
  },

  {
    pattern: /^\/admin\/info-usuario\/?$/,
    // No necesitas 'views' ni 'idType' si no vas a usarlos para actualizar el sidebar
    // Puedes dejarlos vacíos o no incluirlos para mayor claridad.
    // views: [], // O dejarlo fuera
    // idType: [], // O dejarlo fuera
    sidebarAction: 'none', // <-- ¡Esta es la clave!
  },

  // --- Vista instructor ---
  {
    pattern: /^\/instructor\/(\d+)\/fichas\/?$/,
    views: ['main'],
    idType: ['idInstructor'],
    sidebarAction: 'set',
  },

  {
    pattern:
      /^\/instructor\/(\d+)\/ficha\/(\d+)\/(info|aprendices|calendario-ficha)\/?$/,
    views: ['main', 'ficha'],
    idType: ['idInstructor', 'idFicha'],
    sidebarAction: 'set',
  },

  {
    pattern:
      /^\/instructor\/(\d+)\/ficha\/(\d+)\/aprendiz\/(\d+)\/(info|empresa|observaciones|seguimiento|reportes-gfpi-f)\/?$/,
    views: ['main', 'ficha'],
    idType: ['idInstructor', 'idFicha', 'idAprendiz'],
    sidebarAction: 'set',
  },

  {
    pattern: /^\/instructor\/(\d+)\/info-usuario\/?$/,
    // No necesitas 'views' ni 'idType' si no vas a usarlos para actualizar el sidebar
    // Puedes dejarlos vacíos o no incluirlos para mayor claridad.
    // views: [], // O dejarlo fuera
    // idType: [], // O dejarlo fuera
    sidebarAction: 'none', // <-- ¡Esta es la clave!
  },

  // --- Vista aprendiz ---
  {
    pattern: /^\/aprendiz\/(\d+)\/fichas\/?$/,
    views: ['main'],
    idType: ['idAprendiz'],
    sidebarAction: 'set',
  },

  {
    pattern:
      /^\/aprendiz\/(\d+)\/ficha\/(\d+)\/(seguimiento|observaciones|empresa|calendario-ficha|info)\/?$/,
    views: ['main', 'fichasAprendiz'],
    idType: ['idAprendiz', 'idFicha'],
    sidebarAction: 'set',
  },

  {
    pattern: /^\/aprendiz\/(\d+)\/info-usuario\/?$/,
    // No necesitas 'views' ni 'idType' si no vas a usarlos para actualizar el sidebar
    // Puedes dejarlos vacíos o no incluirlos para mayor claridad.
    // views: [], // O dejarlo fuera
    // idType: [], // O dejarlo fuera
    sidebarAction: 'none', // <-- ¡Esta es la clave!
  },
];

/**
 * Hook para sincronizar la pila del sidebar con la ruta actual.
 */
export const useSyncSidebarWithRoute = () => {
  const location = useLocation();
  const {
    setIds,
    sidebarStack,
    resetSidebarView,
    pushSidebarView,
    clearAllIds, // Todavía necesitamos esto para el caso de "no se encontró coincidencia"
    selectedIds, // Necesitamos acceso a selectedIds para la depuración
    // Considera añadir un setAllExtractedIds si quieres reemplazar todos los IDs de forma atómica
    // setAllExtractedIds, // <--- Nueva función a considerar
  } = useSidebar();

  const prevRef = useRef({
    pathname: '',
  });

  // useEffect separado para monitorear cambios en selectedIds
  // useEffect(() => {
  //   console.log('🔄 selectedIds actualizado:', selectedIds);
  // }, [selectedIds]);

  /**
   * Establece el sidebar según las vistas requeridas
   * @param {Array} targetViews - Array de vistas que debe tener el sidebar
   * @param {Object} extractedIds - IDs extraídos para la ruta actual
   */
  const setSidebarViewsAndIds = (targetViews, extractedIds) => {
    // Convertir a string para comparar
    const currentViewsStr = sidebarStack.join(',');
    const targetViewsStr = targetViews.join(',');

    // Si la pila del sidebar ya es correcta, solo actualiza los IDs si han cambiado
    // Esto es para prevenir reseteos innecesarios de la pila del sidebar.
    if (currentViewsStr === targetViewsStr) {
      // console.log(
      //   '🎯 Vistas ya están correctas, solo actualizando IDs si es necesario.'
      // );
      // Solo actualiza los IDs si son diferentes
      if (JSON.stringify(selectedIds) !== JSON.stringify(extractedIds)) {
        clearAllIds(); // Borra los IDs existentes
        Object.entries(extractedIds).forEach(([key, value]) => {
          setIds(key, value);
        });
      }
      return;
    }

    // Resetear y reconstruir el sidebar
    resetSidebarView(); // Esto deja solo ['main'] y LLAMA A clearAllIds()

    // Si necesitamos más vistas además de 'main', las agregamos
    if (targetViews.length > 1) {
      // Agrega las vistas adicionales una por una
      for (let i = 1; i < targetViews.length; i++) {
        pushSidebarView(targetViews[i]);
      }
    }

    // Ahora, establece los IDs después de que las vistas del sidebar se hayan gestionado.
    // Si se llamó a resetSidebarView, clearAllIds() ya se invocó.
    // Por lo tanto, solo necesitamos establecer los nuevos IDs.
    Object.entries(extractedIds).forEach(([key, value]) => {
      //console.log(`   → Seteando: ${key} = ${value}`);
      setIds(key, value);
    });
  };

  // ... (resto de tu useSyncSidebarWithRoute.js) ...

  useEffect(() => {
    const path = location.pathname;
    console.log('🚀 Hook ejecutándose para path:', path);

    if (prevRef.current.pathname === path) {
      console.log('⏭️ Path no cambió, saltando...');
      return;
    }

    let matchFound = false;
    let extractedIdsForRoute = {};
    let targetViewsForRoute = [];
    let currentSidebarAction = 'set'; // Valor por defecto

    for (const route of sidebarRoutes) {
      const match = path.match(route.pattern);
      if (!match) continue;

      matchFound = true;
      currentSidebarAction = route.sidebarAction || 'set'; // Obtener la acción o usar 'set' por defecto

      console.log('✅ Ruta encontrada:', {
        pattern: route.pattern,
        match,
        sidebarAction: currentSidebarAction,
      });

      // Si la acción es 'none', salimos inmediatamente sin hacer cambios en el sidebar.
      if (currentSidebarAction === 'none') {
        console.log(
          '⚠️ sidebarAction es "none", no se realizarán cambios en el sidebar.'
        );
        prevRef.current = { pathname: path }; // Actualizar la referencia previa para evitar bucles
        return; // Salir del useEffect
      }

      // Resto de la lógica de extracción de IDs y vistas solo si sidebarAction NO es 'none'
      if (route.idType && Array.isArray(route.idType)) {
        route.idType.forEach((key, idx) => {
          const capturedValue = match[idx + 1];
          if (capturedValue) {
            extractedIdsForRoute[key] = capturedValue;
          }
        });
      }
      targetViewsForRoute = route.views;

      console.log('🔍 IDs extraídos:', extractedIdsForRoute);
      console.log('📋 Vistas objetivo:', targetViewsForRoute);

      // Se encontró una coincidencia con una acción de sidebar, así que procesamos y salimos del bucle
      break;
    }

    // Actualizar la referencia previa (si no salimos antes por 'none')
    prevRef.current = {
      pathname: path,
    };

    // La lógica para `setSidebarViewsAndIds` o el reinicio,
    // se ejecuta solo si `matchFound` es true Y `currentSidebarAction` NO es 'none'.
    // Esto ya está cubierto por el `return` temprano.
    if (matchFound) {
      // Esta parte solo se ejecuta si currentSidebarAction NO es 'none'
      console.log('📱 Estableciendo vistas y IDs del sidebar...');
      setSidebarViewsAndIds(targetViewsForRoute, extractedIdsForRoute);
    } else {
      console.log('❌ No se encontró ruta, reseteando...');
      resetSidebarView();
    }
  }, [
    location.pathname,
    setIds,
    clearAllIds,
    resetSidebarView,
    pushSidebarView,
    sidebarStack,
    selectedIds,
  ]);
};
