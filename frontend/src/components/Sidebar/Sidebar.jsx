import { useSidebar } from '../../context/SidebarContext';
import NavigationList from './NavigationList';
import { CustomDrawer, SidebarContent } from './Sidebar.style';

/**
 * `Sidebar`
 *
 * Componente que representa la barra lateral de navegación de la aplicación.
 * Se encarga de mostrar los elementos de navegación y gestionar su estado.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {number} [props.drawerWidth=240] - Ancho del Drawer (sidebar).
 * @returns {JSX.Element} Devuelve el componente Sidebar con su contenido y funcionalidad.
 */
const Sidebar = ({ drawerWidth = 100, isMobile }) => {
  const { isSidebarVisible, toggleSidebar } = useSidebar();

  /**
   * Define si el Drawer está abierto:
   * - En móvil (`temporary`), se invierte `isSidebarVisible`
   * para evitar que se abra automáticamente al cambiar de tamaño.
   * - En escritorio (`permanent`), sigue `isSidebarVisible` directamente.
   */

  return (
    <CustomDrawer
      drawerWidth={drawerWidth}
      isCollapsed={!isMobile && !isSidebarVisible}
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? !isSidebarVisible : isSidebarVisible}
      onClose={toggleSidebar}
    >
      <SidebarContent>
        <NavigationList isCollapsed={!isMobile && !isSidebarVisible} />
      </SidebarContent>
    </CustomDrawer>
  );
};

export default Sidebar;
