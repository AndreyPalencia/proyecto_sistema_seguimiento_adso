import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useSidebar } from '../../../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

/**
 * `SubmenuBackButton`
 *
 * Botón que retrocede una vista en el Sidebar y sincroniza la ruta correspondiente.
 *
 * @param {Object} props
 * @param {boolean} props.isCollapsed - Si el sidebar está colapsado
 */
const SubmenuBackButton = ({ isCollapsed }) => {
  const { clearId, popSidebarView, selectedIds, sidebarStack } = useSidebar();
  const { roleUsuario, idUsuario } = useAuth();
  const navigate = useNavigate();

  // Configuración de mapeo de vistas a IDs
  const VIEW_ID_MAP = {
    fichaInstructor: 'idFicha',
    ficha: 'idFicha',
    aprendizAdmin: 'idAprendiz',
    fichasAprendiz: 'idFicha', // 👈 NUEVO
    mainInstructor: 'idInstructorAdmin',

    fichasAprendizAdmin: 'idFicha',
  };

  // Configuración de rutas por rol para la vista 'main'
  const MAIN_ROUTES_BY_ROLE = {
    admin: '/admin',
    instructor: (idUsuario) => `/instructor/${idUsuario}/fichas`,
    aprendiz: (idUsuario) => `/aprendiz/${idUsuario}/fichas`,
    default: '/',
  };

  /**
   * Genera la ruta correspondiente según la vista y los IDs seleccionados
   * @param {string} view - Vista actual
   * @param {Object} ids - IDs seleccionados
   * @returns {string} - Ruta generada
   */
  const generateRoute = (view, ids) => {
    const { idFicha, idAprendiz, idAprendizAdmin, idInstructorAdmin } = ids;

    // Casos específicos de vistas
    const viewRoutes = {
      mainInstructor: () => `/admin/rol/instructor/${idInstructorAdmin}/fichas`,
      fichaInstructor: () =>
        `/admin/rol/instructor/${idInstructorAdmin}/fichas`,
      ficha: () => `/ficha/${idFicha}/aprendices`,
      fichasAprendizAdmin: () =>
        `/admin/rol/aprendiz/${idAprendizAdmin}/fichas`,
      fichasAprendizAdminPerfil: () =>
        `/admin/rol/aprendiz/${idAprendizAdmin}/info-perfil`,
      // fichaAprendiz: () =>
      //   `/admin/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/aprendices`,
      main: () => getMainRoute(),
    };

    // Ejecuta la función correspondiente o retorna ruta por defecto
    const routeGenerator = viewRoutes[view];
    return routeGenerator ? routeGenerator() : '/';
  };

  /**
   * Obtiene la ruta principal según el rol del usuario
   * @returns {string} - Ruta principal
   */
  const getMainRoute = () => {
    if (roleUsuario === 'instructor') {
      return MAIN_ROUTES_BY_ROLE.instructor(idUsuario);
    }
    if (roleUsuario === 'aprendiz') {
      return MAIN_ROUTES_BY_ROLE.aprendiz(idUsuario);
    }

    return MAIN_ROUTES_BY_ROLE[roleUsuario] || MAIN_ROUTES_BY_ROLE.default;
  };

  /**
   * Limpia el ID asociado a la vista actual
   * @param {string} currentView - Vista actual
   */
  const clearViewId = (currentView) => {
    const idKey = VIEW_ID_MAP[currentView];
    if (idKey) {
      clearId(idKey);
    }
  };

  /**
   * Obtiene la vista anterior del stack
   * @param {Array} stack - Stack de vistas
   * @returns {string} - Vista anterior o 'main' por defecto
   */
  const getPreviousView = (stack) => {
    const prevView = stack[stack.length - 2];

    if (roleUsuario === 'aprendiz') {
      if (prevView === 'fichasAprendiz' || prevView === 'ficha') {
        return 'main'; // fuerza ruta main para aprendiz
      }
    }

    return prevView || 'main';
  };

  /**
   * Maneja el click del botón de retroceso
   * @param {Event} e - Evento del click
   */
  const handleClick = (e) => {
    e.preventDefault();

    try {
      const stackCopy = [...sidebarStack];
      const currentView = stackCopy[stackCopy.length - 1];
      const prevView = getPreviousView(stackCopy);

      // Validación: no hacer nada si no hay vista actual
      if (!currentView) {
        console.warn('No hay vista actual en el stack');
        return;
      }

      // Limpia el ID asociado a la vista actual
      clearViewId(currentView);

      // Quita la vista actual del stack
      popSidebarView();

      // Genera y navega a la ruta correspondiente
      const targetRoute = generateRoute(prevView, selectedIds);

      if (targetRoute) {
        navigate(targetRoute);
      } else {
        console.warn(`No se pudo generar ruta para la vista: ${prevView}`);
        navigate('/'); // Fallback a la ruta raíz
      }
    } catch (error) {
      console.error('Error al manejar el retroceso:', error);
      // En caso de error, navegar a una ruta segura
      navigate('/');
    }
  };

  return (
    <ListItem>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon sx={{ color: 'text.primary' }}>
          <NavigateBeforeIcon />
        </ListItemIcon>
        {!isCollapsed && <ListItemText primary="Volver" />}
      </ListItemButton>
    </ListItem>
  );
};

export default SubmenuBackButton;
