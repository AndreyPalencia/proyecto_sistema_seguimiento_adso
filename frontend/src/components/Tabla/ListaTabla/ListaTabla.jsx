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
import ActionsButtons from '../ActionButtons/ActionButtons';
import NoDataComponent from '../NoDataComponent/NoDataComponet';

/**
 * `ListaTabla`
 *
 * Este componente renderiza una tabla en formato de lista utilizando Material-UI.
 * Muestra los datos proporcionados por la propiedad `dataList`, permite excluir ciertas claves de datos
 * mediante la propiedad `dataException`, y proporciona botones de acción en cada fila de la tabla.
 *
 * @example
 * const dataList = [
 *   ["Nombre", "Edad", "Ciudad"],
 *   { id: 1, Nombre: "Juan", Edad: 28, Ciudad: "Madrid" },
 *   { id: 2, Nombre: "Ana", Edad: 34, Ciudad: "Barcelona" }
 * ];
 *
 * const dataException = ["Edad"];
 * const selectedValue = "id";
 *
 * return <ListaTabla dataList={dataList} dataException={dataException} selectedValue={selectedValue} />;
 *
 * @param {Object} props - Props del componente.
 * @param {Array} props.dataList - Lista de datos a mostrar, donde el primer elemento es la cabecera.
 * @param {Array<string>} props.dataException - Lista de claves que no deben mostrarse en la tabla.
 * @param {string} props.selectedValue - Campo que se usará como ID para seleccionar elementos.
 *
 * @returns {JSX.Element} Tabla formateada con los datos proporcionados.
 */
const ListaTabla = ({
  dataList,
  dataException,
  selectedValue,
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
                          padding: '15px 17px',
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
                    <ActionsButtons
                      idSelecion={rowId}
                      isGridView={false}
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

export default React.memo(ListaTabla);
