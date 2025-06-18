import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useSidebar } from '../../../context/SidebarContext';
import { useNavigate } from 'react-router-dom';

/**
 * `SubmenuBackButton`
 * 
 * Componentes que navega hacia atrás en el sidebar y en la URL.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.to - Ruta a la que navegar.
 * @param {boolean} props.isCollapsed - Indica si el sidebar está colapsado.
 * @param {Array} [props.clearIdKeys=[]] - Claves de IDs a limpiar al navegar.
 * 
 * @returns {JSX.Element} Un botón de Material UI con un icono de "volver" y texto opcional, que al hacer clic limpia los IDs y navega a la ruta proporcionada.
 */
const SubmenuBackButton = ({ to, isCollapsed, clearIdKeys = [] }) => {
  //Obtenemos del contexto del sidebar la función para limpiar los ids y la función de quitar de la pila del sidebar un submenú
  const { clearIds, popSidebarView } = useSidebar();
  //Obtenemos la función para navegar entre rutas
  const navigate = useNavigate();

  /**
   * Función para manejar el clic en el botón de volver.
   * Limpia los IDs y navega a la ruta especificada.
   * 
   * @param {React.EventHandler} e - Evento de clic.
   * @returns {void}
   */
  const handleClick = (e) => {
    e.preventDefault();
    if (clearIdKeys.length > 0) {
      clearIds(clearIdKeys);
    }
    popSidebarView();
    navigate(to);
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
