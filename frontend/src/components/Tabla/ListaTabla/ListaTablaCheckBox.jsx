import React, { useEffect, useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

import { StyledTableContainer, TableCellHeader } from './ListaTabla.style';
import ActionsButtonsListBox from '../ActionButtons/ActionButtonsListCheckbox';
import NoDataComponent from '../NoDataComponent/NoDataComponet';

const ListaTablaCheckBox = ({
  dataList,
  dataException,
  selectedValue,
  initialValue = [],
  extraActions,
  rowActions,
  formatCellValue,
}) => {
  //Estado local para almacenar la lista de filas de la tabla.
  //Inicialmente se establece como un array vacío.
  const [rowList, setRowList] = useState([]);

  /**
   * Efecto que actualiza el estado local `rowList` cuando cambia la propiedad `dataList`.
   */
  useEffect(() => {
    if (Array.isArray(dataList) && dataList.length > 0) {
      setRowList(dataList);
    } else {
      setRowList([]);
    }
  }, [dataList]);

  /**
   * Extrae los encabezados de la tabla (el primer elemento de `rowList`).
   * @type {Array<string>}
   */
  const headers = useMemo(() => {
    return Array.isArray(rowList[0]) ? rowList[0] : [];
  }, [rowList]);

  /**
   * Determina si hay datos suficientes para mostrar en la tabla.
   * @type {boolean}
   */
  const hasData = rowList.length > 1;

  return (
    <StyledTableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            {headers.map((nameHeader, index) => (
              <TableCellHeader key={`header-${index}`}>
                {nameHeader}
              </TableCellHeader>
            ))}
            <TableCellHeader key="actions">Acciones</TableCellHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {hasData ? (
            rowList.map((filaTabla, index) => {
              if (index === 0) return null; // Saltamos la cabecera (índice 0)

              const rowId = filaTabla[selectedValue];

              /**
               * ['activo', 'esAdmi'] -> Valora para referencia inicales
               * { activo: 1, nombre: 'Carlos', esAdmi: 0 }
               * { activo: true, esAdmi: false }
               */
              const booleanObject = initialValue.reduce((accumulator, key) => {
                accumulator[key] = Boolean(filaTabla[key]);
                //console.log(filaTabla[key])
                return accumulator;
              }, {});

              //console.log(rowId, booleanObject);

              return (
                <TableRow key={`row-${rowId || index}`}>
                  {Object.entries(filaTabla).map(([key, cell], cellIndex) =>
                    !dataException.includes(key) ? (
                      <TableCell
                        sx={{
                          marginRight: '12px',
                          maxWidth: cell && cell.length > 50 ? 300 : 'none',
                          whiteSpace:
                            cell && cell.length > 50 ? 'normal' : 'nowrap',
                          wordBreak: 'break-word',
                        }}
                        align="left"
                        key={`cell-${cellIndex}`}
                      >
                        {formatCellValue
                          ? formatCellValue({
                              key,
                              value: cell,
                              row: filaTabla,
                            })
                          : cell || ' '}
                      </TableCell>
                    ) : null
                  )}
                  {/*------------ BOTONES DE ACCIONES ------------- */}
                  <TableCell>
                    <ActionsButtonsListBox
                      idSelecionado={rowId}
                      inicialValues={booleanObject}
                      extraActions={extraActions}
                      rowActions={rowActions}
                      rowData={filaTabla}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length + 1} align="center">
                {<NoDataComponent />}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default React.memo(ListaTablaCheckBox);
