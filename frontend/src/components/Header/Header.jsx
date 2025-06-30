import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../context/SidebarContext';
import { useAlert } from '../../context/AlertContext';
import { useNumberNotifications } from '../../context/NumberNotifications';
import { useAuth } from '../../context/AuthContext';

import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';

import { cerrarSesion } from '../../services/Auth';
import { socket } from '../../socket';

import { CustomAppBar, HeaderBox, ButtonHeader } from './Header.style';
import Notificaciones from '../../pages/Notificaciones';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

/**
 * Componente `Header`
 *
 * Este componente es el encabezado de la aplicación y muestra los siguientes elementos:
 * - Un botón de menú para mostrar u ocultar el sidebar. -> Esta en desarollo.
 * - El logo del SENA, que al hacer clic redirige al perfil del usuario.
 * - Un botón para cerrar sesión. -> Esta en desarollo.
 * - Un icono de notificaciones con un contador de notificaciones sin leer.
 * - Un icono de perfil de usuario.
 *
 * Además, maneja el estado para abrir y cerrar el cuadro de notificaciones.
 *
 * @returns {JSX.Element} Componente de encabezado con menú, notificaciones, y perfil.
 */
const Header = () => {
  const { idUsuario, roleUsuario } = useAuth();
  const { toggleSidebar } = useSidebar(); //Función para alternar el sidebar
  const [open, setOpen] = useState(false); //Estado del modal de notificaciones
  const { numberNotifications } = useNumberNotifications(); //Número de notificaciones sin leer
  const { showAlert } = useAlert(); //Para mostrar alertas
  const navigate = useNavigate(); //Para redirigir al login o a otras rutas

  /**
   * Alterna el estado del modal de notificaciones.
   * Si está abierto, lo cierra; si está cerrado, lo abre.
   */
  const handleOpenNotificaciones = () => {
    setOpen((prev) => !prev);
  };

  const cerrarSesionFuncion = async () => {
    try {
      // Emit the event to the server to disconnect the user
      socket.emit('disconnectUsuario', idUsuario);
      const responese = await cerrarSesion();
      if (responese.success) {
        showAlert({
          message: `Se cerró con éxito el inicio de sesión.`,
          variant: 'standard',
          severity: 'success',
        });
        navigate('/auth/login');
      }
    } catch (error) {
      showAlert({
        message: `No se puedo cerrar sesión: ${error.message}`,
        variant: 'standard',
        severity: 'warning',
      });
    }
  };

  return (
    <CustomAppBar position="static">
      <Toolbar>
        <HeaderBox sx={{ justifyContent: 'start' }}>
          <IconButton
            aria-label="Menu"
            sx={{ color: 'background.black' }}
            onClick={toggleSidebar}
          >
            <MenuIcon sx={{ fontSize: 28 }} />
          </IconButton>
          <Link to={`/${roleUsuario}/${idUsuario}/`}>
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
            onClick={cerrarSesionFuncion}
          >
            <Typography
              variant="button"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Cerrar sesión
            </Typography>
          </ButtonHeader>
          {/* Icono de notificaciones con badge para el número de notificaciones sin leer */}
          <IconButton
            aria-label="Notificaciones"
            sx={{ color: '#1C1B1F' }}
            onClick={handleOpenNotificaciones}
          >
            <Badge badgeContent={numberNotifications} color="error">
              <NotificationsIcon sx={{ fontSize: 28 }} />
            </Badge>
          </IconButton>

          <IconButton
            aria-label="perfil"
            sx={{ color: 'text.primary' }}
            onClick={() => {
              if (roleUsuario === 'admin')
                navigate(`/${roleUsuario}/info-usuario`);
              else navigate(`/${roleUsuario}/${idUsuario}/info-usuario`);
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 28 }} />
          </IconButton>
          <IconButton
            aria-label="perfil"
            sx={{ color: 'text.primary' }}
            onClick={() => {
              window.open('https://doc.sistemasaep.com/auth/login');
            }}
          >
            <HelpOutlineIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </HeaderBox>
      </Toolbar>

      <Notificaciones open={open} handleClose={handleOpenNotificaciones} />
    </CustomAppBar>
  );
};

export default Header;
