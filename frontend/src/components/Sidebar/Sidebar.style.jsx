import { styled } from '@mui/material/styles';
import { Drawer, Box } from '@mui/material';

/**
 * CustomDrawer: Componente estilizado basado en `Drawer` de MUI.
 *
 * Props:
 * - `drawerWidth` (number): Define el ancho del Drawer.
 *   Es obligatorio para las variantes `persistent` y `permanent`.
 * - `position` (string): Se establece en `"relative"` para ajustarse
 *   al contenedor del Drawer. En dispositivos móviles, este ajuste se ignora.
 * - `isCollapsed` (boolean): Indica si el Drawer está colapsado para mostra solo iconos.
 *
 * Características:
 * -  se utiliza para evitar que `drawerWidth`
 *   sea pasado al DOM, ya que es una prop utilizada solo para la lógica de estilos.
 * - Se establece `flexShrink: 0` para evitar que el Drawer reduzca su tamaño
 *   cuando el espacio es limitado.
 * - Se modifica el fondo con `theme.palette.background.default`.
 * - Se elimina el borde derecho del Drawer mediante la clase `.MuiDrawer-paper`.
 */

export const CustomDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'drawerWidth' && prop !== 'isCollapsed',
})(({ theme, drawerWidth, isCollapsed }) => ({
  width: isCollapsed ? 88 : drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: isCollapsed ? 88 : drawerWidth,
    position: 'relative',
    backgroundColor: theme.palette.background.default,
    borderRight: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.easeInOut, // << más suave
      duration: isCollapsed
        ? theme.transitions.duration.leavingScreen // al colapsar
        : theme.transitions.duration.enteringScreen, // al expandir
    }),
    overflowX: 'hidden',
  },
}));


//SidebarContent: Contenedor del contenido del sidebar.
export const SidebarContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'auto',
});
