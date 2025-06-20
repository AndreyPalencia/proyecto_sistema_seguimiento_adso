import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Outlet } from 'react-router-dom';

//Componetes que hacen parte del layout
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import { SidebarProvider } from '../context/SidebarContext';

//Usamos el useHeader para obtener la altura del header y calcular la pantalla principal
import { useHeader } from '../context/HeaderContext';
import RouteLoader from '../components/RouteLoader';
import { useAuth } from '../context/AuthContext';
import { socket } from '../socket';

import { useSocketNotifications } from '../hook/socket/useSocketNotifications';

/**
 * Componente `DashboardLayout`
 *
 * Este componente define la estructura principal del layout para el dashboard de la aplicación.
 * Contiene el `Header`, el `Sidebar` y el contenido principal, gestionado mediante el componente `Outlet`.
 *
 * **Funciones principales:**
 * - Calcula dinámicamente la altura del contenido principal en función del `Header` y un `Divider`.
 * - Muestra el `Sidebar` en pantallas grandes y lo oculta en dispositivos móviles.
 * - Llama al componente `RouteLoader` para ejecutar un hook que verifica la ruta actual y carga datos necesarios
 *   antes de renderizar el contenido asociado a esa ruta.
 * - Footer sticky que se mantiene abajo cuando hay poco contenido, pero sigue el scroll cuando hay mucho contenido.
 *
 * @returns {JSX.Element} - Devuelve la disposición del `DashboardLayout` con el `Header`, `Sidebar` y el contenido principal.
 */
const DashboardLayout = () => {
  const { headerHeight } = useHeader();

  const { idUsuario } = useAuth();

  useSocketNotifications(idUsuario);

  return (
    <SidebarProvider>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          height: '100vh',
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
          overflow: 'hidden',
        }}
      >
        <Header />
        <Divider />
        {/**El calculo de la altura del grid container se hace atravez de valor de headerHeight del header + 1 por el heigth del divider
         * que se encuentra entre el header y el contenido principal restando esa suma al 100vh se obtiene el tamaño del contenido principal
         */}
        <Grid
          container
          spacing={0}
          sx={{
            height: `calc(100vh - ${headerHeight + 10}px)`,
            overflow: 'hidden',
            width: '100%',
          }}
        >
          <Sidebar />

          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: 'none', sm: 'block' } }}
          />

          <Grid
            size="grow"
            sx={{
              height: '100%',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <Box
              component="div"
              className="scroll-container"
              sx={{
                padding: '0px 22px',
                width: '100%',
                boxSizing: 'border-box',
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Contenedor del contenido principal que crece */}
              <Box sx={{ flex: '1 0 auto' }}>
                <RouteLoader />
                <Outlet />
              </Box>

              {/* Footer sticky */}
              <Box
                component="footer"
                sx={{
                  marginTop: '2rem',
                  padding: '1rem 0',
                  borderTop: '1px solid #e0e0e0',
                  textAlign: 'center',
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  flexShrink: 0,
                }}
              >
                © {new Date().getFullYear()} SAEP. Sistema de Seguimiento al
                Aprendiz en Etapa Práctica - SAEP.
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </SidebarProvider>
  );
};

export default DashboardLayout;
