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
  shouldForwardProp: (prop) => prop !== 'drawerWidth',
})(({ theme, drawerWidth }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    position: 'relative',
    backgroundColor: theme.palette.background.default,
  },
  '& .css-o140if-MuiPaper-root-MuiDrawer-paper': {
    borderRight: 0,
  },
}));

//SidebarContent: Contenedor del contenido del sidebar.
export const SidebarContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'auto',
});
