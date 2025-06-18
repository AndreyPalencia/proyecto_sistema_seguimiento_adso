import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import { useActionsButtonsContext } from '../../../context/ActionsButtonsContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, memo } from 'react';

/**
 * Componente de botones de acción configurable.
 * Este componente muestra un conjunto de botones de acción. Dependiendo de si estamos en la vista de cuadrícula
 * o no, los botones se muestran de diferentes maneras (un solo ícono o un menú con múltiples opciones).
 *
 * @example
 * const actionsButtons = [
 *   { icon: EditIcon, position: 'left', action: handleEdit, tooltip: 'Editar', id: 'MainGrid'},
 *   { icon: DeleteIcon, position: 'center', action: handleDelete, tooltip: 'Eliminar,  },
 * ];
 *
 * return <ActionsButtons idSelecion={1} isGridView={true} />;
 *
 * @param {Object} props - Props del componente.
 * @param {string} props.idSelecion - El ID del elemento seleccionado sobre el que se ejecutarán las acciones.
 * @param {boolean} props.isGridView - Indica si estamos en la vista de cuadrícula o no.
 *
 * @returns {JSX.Element|null} Un conjunto de botones de acción que se muestran dependiendo de la vista.
 */

const ActionsButtons = memo(({ idSelecion, isGridView, extraActions = [] }) => {
  //Accede a las acciones configuradas en el contexto
  const { actionsButtons: globalActions } = useActionsButtonsContext();

  const combinedActions = [...globalActions, ...extraActions];

  //Estado para manejar la apertura y cierre del menú de opciones
  const [anchorEl, setAnchorEl] = useState(null);
  //Determina si el menú de opciones está abierto o cerrado
  const open = Boolean(anchorEl);

  /**
   * Maneja la apertura del menú de opciones.
   * @param {Object} event - El evento de clic.
   */
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Maneja el cierre del menú de opciones.
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  //Si no hay botones de acción configurados, no se renderiza nada
  if (!Array.isArray(combinedActions) || combinedActions.length === 0) {
    return null;
  }

  return (
    <>
      {/* Si estamos en la vista de cuadrícula, mostramos el botón "more" */}
      {isGridView && (
        <Tooltip title="Más opciones">
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon sx={{ color: 'black', fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      )}

      {/* Menú de opciones cuando se hace clic en "More" */}
      {isGridView && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {combinedActions.map((button, index) => {
            if (button.icon && button.action) {
              const Icon = button.icon; // El ícono es un componente

              return (
                <MenuItem
                  key={`menu-item-${index}`}
                  onClick={() => {
                    button.action(idSelecion); // Ejecuta la acción directamente
                    handleClose(); // Cierra el menú después de hacer clic
                  }}
                >
                  <ListItemIcon>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={button.tooltip} />
                </MenuItem>
              );
            }
            return null;
          })}
        </Menu>
      )}

      {/* Renderiza los botones de acción normales (sin menú) */}
      {!isGridView && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
            flexWrap: 'nowrap',
          }}
        >
          {combinedActions.map((button, index) => {
            if (!button.icon || !button.action) return null;

            const Icon = button.icon; // El ícono es un componente

            return (
              <Tooltip key={`button-${index}`} title={button.tooltip || ''}>
                <IconButton
                  onClick={() => button.action(idSelecion)} // Ejecuta la acción
                  sx={{
                    color: button.color || 'inherit', // Color del ícono configurable
                    position: 'relative',
                    left: button.position === 'left' ? 0 : 'auto',
                    right: button.position === 'right' ? 0 : 'auto',
                  }}
                >
                  <Icon /> {/* Renderiza el ícono dinámicamente */}
                </IconButton>
              </Tooltip>
            );
          })}
        </Box>
      )}
    </>
  );
});

export default ActionsButtons;
