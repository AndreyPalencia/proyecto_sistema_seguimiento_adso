import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';

import { CustomAppBar, HeaderBox, ButtonHeader } from './Header.style';

import { Link } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';

/**
 * Header: Muestra la barra de navegación superior de la aplicación.
 *
 * Este componente incluye:
 * - Un botón de menú para alternar la barra lateral.
 * - Un logotipo que enlaza con la página de inicio.
 * - Un botón para cerrar la sesión.
 * - Iconos para notificaciones y perfil de usuario.
 *
 */

const Header = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <CustomAppBar position="static">
      <Toolbar>
        <HeaderBox sx={{ justifyContent: 'start' }}>
          <IconButton
            aria-label="Menu"
            sx={{
              color: 'background.black',
              //display: { xs: "block", sm: "none" },
            }}
            onClick={toggleSidebar}
          >
            <MenuIcon sx={{ fontSize: 28 }} />
          </IconButton>
          <Link to={'/'}>
            <img
              src="/logoSena.png"
              alt="Logo del SENA"
              style={{ width: 135, height: 'auto', objectFit: 'contain' }}
            />
          </Link>
        </HeaderBox>
        <HeaderBox>
          <ButtonHeader
            variant="contained"
            aria-label="Cerrar sesión"
            startIcon={<LogoutIcon sx={{ fontSize: 28 }} />}
          >
            <Typography
              variant="button"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Cerrar sesión
            </Typography>
          </ButtonHeader>

          <IconButton
            aria-label="notificaciones"
            sx={{ color: 'text.primary' }}
          >
            <NotificationsIcon sx={{ fontSize: 28 }} />
          </IconButton>

          <IconButton aria-label="perfil" sx={{ color: 'text.primary' }}>
            <AccountCircleIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </HeaderBox>
      </Toolbar>
    </CustomAppBar>
  );
};

export default Header;
