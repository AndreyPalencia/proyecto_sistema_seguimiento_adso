import React, { useState, useEffect, useCallback } from 'react';
import { useActionsButtonsContext } from '../../../context/ActionsButtonsContext';

import { Box, Typography } from '@mui/material';

import ActionsButtons from '../ActionButtons/ActionButtons';
import { GridContainer, GridItem, ButtonGroup } from './CuadroTabla.style';
import NoDataComponent from '../NoDataComponent/NoDataComponet';

/**
 * `CuadroTabla`
 *
 * Este componente muestra los datos en un formato de cuadrícula, donde cada celda de la cuadrícula
 * corresponde a una fila de datos. Además, cada celda permite realizar acciones mediante un botón
 * de acción relacionado con el ID de la fila.
 *
 * @example
 * const dataList = [
 *   { id: 1, title: "Item 1", subtitle: "Descripción 1" },
 *   { id: 2, title: "Item 2", subtitle: "Descripción 2" }
 * ];
 * const gridOptions = { title: "title", subtitle: "subtitle" };
 * const selectedValue = "id";
 *
 * return <CuadroTabla dataList={dataList} gridOptions={gridOptions} selectedValue={selectedValue} />;
 *
 * @param {Object} props - Props del componente.
 * @param {Array<Object>} props.dataList - Lista de objetos que contienen los datos a mostrar en la cuadrícula.
 * @param {Object} props.gridOptions - Opciones de configuración de la cuadrícula. Debe contener los campos `title` y `subtitle` que se mostrarán en cada celda.
 * @param {string} props.selectedValue - Campo que se utilizará como ID para seleccionar elementos y realizar acciones sobre ellos.
 *
 * @returns {JSX.Element} Cuadrícula renderizada con los datos proporcionados.
 */
const CuadroTabla = ({
  dataList,
  gridOptions,
  selectedValue,
  extraActions,
  rowActions,
}) => {
  //Estado local para almacenar la lista de filas de la tabla.
  //Inicialmente se establece como un array vacío.
  const [rowList, setRowList] = useState([]);
  const { actionsButtons } = useActionsButtonsContext();

  /**
   * Actualiza el estado `rowList` cuando cambia `dataList`.
   */
  useEffect(() => {
    setRowList(dataList || []);
  }, [dataList]);

  /**
   * Maneja el clic en una celda de la cuadrícula, ejecutando la acción correspondiente.
   * @param {string|number} id - ID de la fila seleccionada.
   */
  const handleMainGridClick = useCallback(
    (rowData, rowId) => {
      const rowBtns = rowActions?.(rowData ?? []) || [];
      const allButtons = [...actionsButtons, ...rowBtns]; // prioridad a globales

      const mainGridAction = allButtons.find(
        (btn) => btn.id === 'MainGrid'
      )?.action;
      mainGridAction?.(rowId);
    },
    [actionsButtons, rowActions]
  );
  

  /**
   * Determina si hay datos suficientes para mostrar en la tabla.
   * @type {boolean}
   */
  const hasData = rowList.length > 1;

  return (
    <GridContainer container>
      {hasData ? (
        rowList.map((row, index) => {
          if (index === 0) return null; // Omitir la cabecera

          const rowId = row[selectedValue];

          console.log;

          return (
            <GridItem
              xs={12}
              sm={9}
              md={10}
              key={`grid-item-${rowId || index}`}
            >
              <Box
                onClick={() => handleMainGridClick(row, rowId)}
                sx={{
                  height: '80%',
                  backgroundColor: '#39A900',
                  backgroundImage: 'url(/src/assets/background.svg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '5px 5px 0px 0px',
                }}
              />
              <Box
                sx={{
                  height: '20%',
                  display: 'flex',
                  justifyContent: 'center',
                  borderTop: '1px solid #000',
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      width: '240px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      marginTop: '3px',
                    }}
                    component="h2"
                    variant="subtitle1"
                    fontWeight="600"
                  >
                    {Array.isArray(gridOptions.title)
                      ? gridOptions.title.map((item) => {
                          return `${row[item].trim()} `;
                        })
                      : row[gridOptions.title]}
                  </Typography>
                  <Typography
                    sx={{
                      width: '240px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    component="h3"
                    variant="subtitle2"
                  >
                    {Array.isArray(gridOptions.subtitle)
                      ? gridOptions?.subtitle.map((item) => {
                          return `${row[item]} `;
                        })
                      : row[gridOptions.subtitle]}
                  </Typography>
                </Box>
                <ButtonGroup>
                  {
                    <ActionsButtons
                      idSelecion={rowId}
                      isGridView={true}
                      extraActions={extraActions}
                      rowActions={rowActions}
                      rowData={row}
                    />
                  }
                </ButtonGroup>
              </Box>
            </GridItem>
          );
        })
      ) : (
        <GridItem xs={12} sm={9} md={10} key={`grid-item-no-dat`}>
          <Box
            sx={{
              height: '80%',
              borderRadius: '5px 5px 0px 0px',
            }}
          >
            {<NoDataComponent />}
          </Box>
        </GridItem>
      )}
    </GridContainer>
  );
};

export default React.memo(CuadroTabla);
