import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSidebar } from '../../../context/SidebarContext';
import { sidebarMenus } from '../routes/NavigationConfig';
import { useAuth } from '../../../context/AuthContext';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

/**
 * `SidebarItem`
 *
 * Componente que representa un elemento del menú lateral de la aplicación.
 * Se encarga de mostrar los íconos y etiquetas correspondientes,
 * así como de manejar la apertura y cierre de submenús.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.item - Nombre del elemento del menú.
 * @param {Object} props.config - Configuración del elemento del menú.
 * @param {string} props.location - Path que indica a donde deber redirigir.
 * @returns {JSX.Element} Devuleve un ítem de menú y, en caso de tener submenú, también el submenú correspondiente.
 */
const SidebarItem = ({ item, config, location, isCollapsed }) => {
  //Obtener el contexto del sidebar y la autenticación el rol del usuario y los ids seleccionados
  const { roleUsuario } = useAuth();
  const { selectedIds } = useSidebar();
  //Estado para manejar la apertura y cierre del submenú
  const [openSubMenu, setOpenSubMenu] = useState(true);

  //Determinar si este item es Aprendiz, para mostra el submenú a nivel del menú de ficha
  const isAprendiz = item === 'aprendiz';
  const isInstructorAdmin = item === 'mainInstructor';

  //Determinar si la ruta actual coincide con la ruta del ítem
  const isActive = location.pathname.includes(config[item]?.path);

  //Obtener el array de elementos del menú aprendiz del rol del usuario
  const menuItemsAprendiz = sidebarMenus[roleUsuario]?.['aprendiz'] || [];

  //Obtener el array de elementos del menú instructor del rol del admin
  const menuItemsInstructorAdmin =
    sidebarMenus[roleUsuario]?.['mainInstructor'] || [];

  //Cuando se selecciona un aprendiz, se debe abrir automáticamente el submenú
  useEffect(() => {
    if (isAprendiz && selectedIds.idAprendiz) {
      setOpenSubMenu(true);
    }

    if (isInstructorAdmin && selectedIds.idInstructor) {
      setOpenSubMenu(true);
    }
  }, [selectedIds.idAprendiz]);

  //Determinar si la ruta actual incluye '/aprendiz/'
  //Esto es para manejar el caso en que se navega directamente a una ruta de aprendiz
  const isAprendizRoute = location.pathname.includes('/aprendiz/');
  const isInstructorAdminRoute = location.pathname.includes('/instructor/');

  // Manejar clic en el ítem
  const handleClick = () => {
    setOpenSubMenu((prev) => !prev); // Alternar el estado del submenú
  };

  return (
    <div key={item}>
      {item !== 'aprendiz' && item !== 'mainInstructor' && (
        <ListItem>
          {/* {console.log('item', item)} */}
          {/* {console.log('sidebarStack', sidebarStack)} */}
          <ListItemButton
            selected={isActive}
            component={config[item]?.path ? Link : 'div'}
            to={config[item]?.path}
            onClick={config[item]?.onClick || (() => {})}
          >
            <ListItemIcon sx={{ color: 'text.primary' }}>
              {config[item]?.icon}
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary={config[item]?.label} />}
          </ListItemButton>
        </ListItem>
      )}

      {/* Renderizar el submenú si corresponde */}
      {item === 'aprendiz' && (selectedIds.idAprendiz || isAprendizRoute) && (
        <>
          <ListItem>
            <ListItemButton
              selected={isActive}
              component={config[item]?.path ? Link : 'div'}
              to={config[item]?.path}
              onClick={handleClick}
            >
              {!isCollapsed && (
                <ListItemIcon sx={{ color: 'text.primary' }}>
                  {config[item]?.icon}
                </ListItemIcon>
              )}
              {!isCollapsed && <ListItemText primary={config[item]?.label} />}
              {openSubMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
            <List component="div">
              {menuItemsAprendiz.map((subItem) => (
                <ListItemButton
                  key={config[subItem]?.label}
                  data-list="Nada"
                  sx={{ pl: !isCollapsed ? 6 : 4 }}
                  selected={location.pathname.includes(config[subItem]?.path)}
                  component={Link}
                  to={config[subItem]?.path}
                >
                  <ListItemIcon sx={{ color: 'text.primary' }}>
                    {config[subItem]?.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText primary={config[subItem]?.label} />
                  )}
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </>
      )}

      {item === 'mainInstructor' &&
        (selectedIds.idInstructor || isInstructorAdminRoute) && (
          <>
            <ListItem>
              <ListItemButton
                selected={isActive}
                component={config[item]?.path ? Link : 'div'}
                to={config[item]?.path}
                onClick={handleClick}
              >
                {!isCollapsed && (
                  <ListItemIcon sx={{ color: 'text.primary' }}>
                    {config[item]?.icon}
                  </ListItemIcon>
                )}
                {!isCollapsed && <ListItemText primary={config[item]?.label} />}
                {openSubMenu ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
              <List component="div">
                {menuItemsInstructorAdmin.map((subItem) => (
                  <ListItemButton
                    key={config[subItem]?.label}
                    data-list="Nada2"
                    sx={{ pl: !isCollapsed ? 6 : 4 }}
                    selected={location.pathname.includes(config[subItem]?.path)}
                    component={Link}
                    to={config[subItem]?.path}
                  >
                    <ListItemIcon sx={{ color: 'text.primary' }}>
                      {config[subItem]?.icon}
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText primary={config[subItem]?.label} />
                    )}
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </>
        )}
    </div>
  );
};

export default SidebarItem;
