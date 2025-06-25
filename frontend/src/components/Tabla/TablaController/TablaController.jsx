import GeneralFilterButtons from './GeneralFilterButtons/GeneralFilterButtons';
import { useFilterButtons } from '../../../context/FilterButtonsContext';
import { useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';

import { useTabla } from '../../../context/TablaContext';
import { FiList, FiGrid } from 'react-icons/fi';
import { ViewChangeButton, BoxFilter } from './TablaController.style';

/**
 * `TablaController`
 *
 * Este componente actúa como un controlador visual para tablas de datos. Ofrece múltiples funcionalidades
 * de interfaz que mejoran la experiencia del usuario:
 *
 * - **Filtrado**: permite aplicar filtros dinámicos mediante un conjunto de botones configurables.
 * - **Cambio de vista**: alterna entre vista de lista (`FiList`) y vista de tarjetas/grid (`FiGrid`).
 * - **Acción contextual**: muestra un botón flotante para acciones como "Agregar", dependiendo de la variante.
 *
 *
 * ### Variantes soportadas:
 * - `'general'`: muestra los botones de cambio de vista (lista/grid).
 * - `'agregar'`: muestra un botón de acción con ícono, usando el título y la acción del contexto.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object.<string, string>} props.filters - Objeto de filtros disponibles. Las claves representan el nombre mostrado y los valores el identificador interno.
 * @param {string} [props.variant='general'] - Define el comportamiento del componente. Puede ser `'general'` o `'agregar'`.
 * @param {string} props.defaultValuefilterSearch - Valor por defecto que debe ser seleccionado automáticamente al montar el componente.
 *
 * @returns {JSX.Element} Elemento React renderizado.
 *
 * @example
 * <TablaController
 *   filters={{ Todos: '', Activos: '1', Inactivos: '0' }}
 *   variant="general"
 *   defaultValuefilterSearch="1"
 * />
 */

const TablaController = ({
  filters,
  defaultValuefilterSearch,
  buttonAction = [],
}) => {
  const { isTablaList, switchTabla } = useTabla(); // Extraemos funciones y estados del contexto `useTabla`

  const {
    filterButtons,
    handleFilterButtons,
    handleFilterFlagButtons,
    handleFilterActiveButtons,
  } = useFilterButtons(); // Extraemos funciones y estados del contexto `useFilterButtons`

  /**
   * Función para validar el valor de un filtro.
   * Verifica si el valor es un número y lo convierte en un valor booleano si es necesario.
   *
   * @param {string} name - Nombre del filtro seleccionado.
   * @returns {boolean|string} - Devuelve `true` o `false` si es un número, o el mismo valor si no lo es.
   */
  const validatedValue = (name) => {
    const isNumber = !isNaN(name) && name !== ''; // Verifica si es un número válido
    return isNumber ? Boolean(Number(name)) : name; // Convierte a booleano si es un número, de lo contrario mantiene el valor original
  };

  /**
   * Maneja el cambio de filtro cuando el usuario selecciona una opción.
   * Si el valor está vacío, desactiva el filtro; de lo contrario, lo activa.
   *
   * @param {Event} event - Evento generado por el cambio en la selección del filtro.
   */
  const handleChangeFilter = (event) => {
    const { name } = event.target; // Extrae el nombre del filtro seleccionado
    const nameValidated = validatedValue(name); // Valida el valor del filtro

    if (nameValidated === '') {
      handleFilterFlagButtons(false); // Desactiva el estado del filtro
      handleFilterActiveButtons(''); // Restablece el filtro activo
    } else {
      handleFilterFlagButtons(true); // Activa el filtro
      handleFilterActiveButtons(nameValidated); // Establece el filtro activo con el valor validado
    }
  };

  /**
   * Aplica el valor predeterminado del filtro si existe.
   * Si `defaultValuefilterSearch` tiene un valor, lo establece como filtro activo al cargar el componente.
   */
  const handleDefaultValueFilter = () => {
    if (!defaultValuefilterSearch) return; // Si no hay un valor predeterminado, no hace nada
    //console.log(defaultValuefilterSearch, 'defaultValuefilterSearch -> handleDefaultValueFilter');

    const valueDefault = validatedValue(defaultValuefilterSearch); // Valida el valor predeterminado
    //console.log(valueDefault)
    handleFilterFlagButtons(true); // Activa el estado del filtro
    handleFilterActiveButtons(valueDefault); // Aplica el valor predeterminado como filtro activo
  };

  /**
   * Efecto que se ejecuta cuando cambia `filters`.
   * - Establece los filtros disponibles en el estado del contexto.
   * - Aplica el filtro por defecto si está definido.
   */
  useEffect(() => {
    handleFilterButtons(filters); // Aplica los filtros disponibles
    handleDefaultValueFilter(); // Aplica el filtro predeterminado si existe
  }, [filters]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // Alinea a la izquierda
          alignItems: 'center',
          gap: 2,
          overflowX: 'auto', // Permite desbordamiento horizontal
          whiteSpace: 'nowrap', // No permite que el contenido se divida en varias líneas
        }}
      >
        <GeneralFilterButtons
          filterButtons={filterButtons} // Pasa los botones de filtro actuales
          handleChangeFilter={handleChangeFilter} // Maneja los cambios en los filtros
          defaultValuefilterSearch={defaultValuefilterSearch}
        />

        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {buttonAction.map((boton, index) => {
              const Icon = boton.icon;
              const size = boton.size;
              return (
                <Tooltip key={index} title={boton?.title ?? 'Accion'}>
                  <IconButton
                    onClick={() => {
                      if (boton?.onAction) {
                        boton.onAction(); // Execute the action if it's defined
                      } else {
                        console.log('Action not defined'); // Log to console if no action is defined
                      }
                    }}
                    color="primary"
                    sx={{
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      },
                    }}
                  >
                    {boton.iconReact ? (
                      <Icon size={size ? size : '120px'} />
                    ) : (
                      <Icon sx={{ fontSize: size ? size : '120px' }} />
                    )}
                  </IconButton>
                </Tooltip>
              );
            })}
            {/* <Tooltip title={actionAdd?.title ?? 'Agregar'}>
              <IconButtonAdd
                onClick={() => {
                  if (actionAdd?.onAction) {
                    actionAdd.onAction(); // Execute the action if it's defined
                  } else {
                    console.log('Action not defined'); // Log to console if no action is defined
                  }
                }}
                color="primary"
                sx={{
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                <AddIcon sx={{ fontSize: 32 }} />
              </IconButtonAdd>
            </Tooltip> */}
            <BoxFilter>
              <Tooltip title="Lista">
                <ViewChangeButton
                  isTablaList={isTablaList}
                  onClick={switchTabla}
                >
                  <FiList size={20} color={isTablaList ? 'green' : '#000'} />
                </ViewChangeButton>
              </Tooltip>
              <Tooltip title="Cuadricula/Galeria">
                <ViewChangeButton
                  isTablaList={!isTablaList}
                  onClick={switchTabla}
                >
                  <FiGrid size={20} color={isTablaList ? '#000' : 'green'} />
                </ViewChangeButton>
              </Tooltip>
            </BoxFilter>
          </Box>
        </>
      </Box>
    </>
  );
};

export default TablaController;
