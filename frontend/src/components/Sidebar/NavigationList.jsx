import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';

import {
  navigationConfig,
  roleDisplayConfig,
  sidebarMenus,
} from './routes/NavigationConfig';

import { useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';
import SubmenuBackButton from './components/SubmenuBackButton';
import SidebarItem from './components/SidebarItem';
import { useSyncSidebarWithRoute } from '../../hook/useSyncSidebarWithRoute';

/**
 * `NavigationList`
 *
 * Componente que representa la lista de navegación del sidebar.
 * Muestra los elementos del menú según el rol del usuario y la vista actual.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isCollapsed - Indica si el sidebar está colapsado.
 * @returns {JSX.Element} Devuelve la lista de navegación del sidebar con los elementos correspondientes.
 */
const NavigationList = ({ isCollapsed }) => {
  //Obtenemos el rol del usuario y el id del usuario desde el contexto de autenticación
  const { idUsuario, roleUsuario } = useAuth();
  //Obtenemos del contexto sidebar la función para alternar el sidebar y la pila de vistas del sidebar
  //y la función para resetear la vista del sidebar y los ids seleccionados
  const { sidebarStack, resetSidebarView, selectedIds, clearId, clearAllIds } =
    useSidebar();

  //Obtenemos la función para sincronizar el sidebar con la ruta actual
  //Esto es para asegurarnos de que el sidebar se sincronice con la ruta actual al cargar la página
  useSyncSidebarWithRoute();

  // Obtenemos la url actual
  const location = useLocation();

  // Determinar la vista actual del sidebar
  const currentView = useMemo(() => {
    if (typeof sidebarStack === 'string') {
      return sidebarStack;
    } else if (Array.isArray(sidebarStack) && sidebarStack.length > 0) {
      return sidebarStack[sidebarStack.length - 1];
    }
    return 'main';
  }, [sidebarStack]);

  // Obtener los elementos del menú para la vista actual
  const menuItems = useMemo(() => {
    return sidebarMenus[roleUsuario]?.[currentView] || [];
  }, [roleUsuario, currentView]);

  // Configuración de navegación
  const config = navigationConfig(idUsuario, roleUsuario, selectedIds, clearId);
  const roleInfo = roleDisplayConfig(idUsuario)[roleUsuario] || {};

  // Verificar si estamos en un submenú
  const estaEnSubmenu = useMemo(() => {
    return (
      Array.isArray(sidebarStack) &&
      sidebarStack.length > 1 &&
      currentView !== 'main'
    );
  }, [sidebarStack, currentView]);

  // Asegurar que el sidebar se inicialice correctamente
  useEffect(() => {
    if (
      !sidebarStack ||
      !Array.isArray(sidebarStack) ||
      sidebarStack.length === 0
    ) {
      resetSidebarView();
    }
  }, [sidebarStack, resetSidebarView]);

  return (
    <>
      {/* Mostrar información del rol actual */}
      <List sx={{ padding: 0 }}>
        <ListItem key={`${roleInfo.label}`}>
          <ListItemButton
            component={Link}
            to={roleInfo.path}
            onClick={() => {
              resetSidebarView();
              clearAllIds();
            }}
          >
            {/* {console.log('selectedIds', selectedIds)} */}
            <ListItemIcon sx={{ color: 'text.primary' }}>
              {roleInfo.icon}
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary={roleInfo.label} />}
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      {/* Mostrar botón para volver si estamos en un submenú */}
      {estaEnSubmenu && <SubmenuBackButton isCollapsed={isCollapsed} />}

      {/* Listar elementos del menú para la vista actual */}
      <List>
        {menuItems.map((item) => (
          <SidebarItem
            key={`${config[item]?.label}-${config[item]?.path}`} // ahora es seguro
            item={item}
            config={config}
            location={location}
            isCollapsed={isCollapsed}
          />
        ))}
      </List>
    </>
  );
};

export default NavigationList;
