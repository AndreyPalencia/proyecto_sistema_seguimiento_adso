import {  useMediaQuery, useTheme } from "@mui/material";
import { useSidebar } from "../../context/SidebarContext";
import NavigationList from "./NavigationList";
import { CustomDrawer, SidebarContent } from "./Sidebar.style";

const Sidebar = ({ userRole, drawerWidth = 240 }) => {

  const theme = useTheme();
  const { isSidebarVisible, toggleSidebar } = useSidebar();

  //isMovile = Determina si la pantalla es móvil (menos de 600px).
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /**
   * Define si el Drawer está abierto:
   * - En móvil (`temporary`), se invierte `isSidebarVisible` 
   * para evitar que se abra automáticamente al cambiar de tamaño.
   * - En escritorio (`permanent`), sigue `isSidebarVisible` directamente.
   */

  return (
    <CustomDrawer
      drawerWidth={drawerWidth}
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? !isSidebarVisible : isSidebarVisible}
      onClose={toggleSidebar}
    >
      <SidebarContent>
        <NavigationList userRole={userRole} />
      </SidebarContent>
    </CustomDrawer>
  );
};

export default Sidebar;
