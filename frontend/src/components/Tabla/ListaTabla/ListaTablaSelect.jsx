import React, { useEffect, useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';

import { StyledTableContainer, TableCellHeader } from './ListaTabla.style';
import { useCheckbox } from '../../../context/CheckboxContext';
import NoDataComponent from '../NoDataComponent/NoDataComponet';

const ListaTablaSelect = ({
  dataList,
  dataException,
  selectedValue, // This prop should ideally be used for initial selection, not ongoing state
  multiSelect = false,
}) => {
  const [rowList, setRowList] = useState([]);
  const [localSelectedRowId, setLocalSelectedRowId] = useState(null); // Local state for single selection
  const [localSelectedRows, setLocalSelectedRows] = useState([]); // Local state for multi-selection

  const { selectItem, selectMultiple } = useCheckbox(); // Get the functions from context

  // Effect to initialize local state based on `selectedValue` prop for single selection
  useEffect(() => {
    if (!multiSelect && selectedValue !== undefined && selectedValue !== null) {
      setLocalSelectedRowId(selectedValue);
    }
  }, [selectedValue, multiSelect]); // Only run when selectedValue or multiSelect changes

  // Effect to initialize local state based on `selectedValue` prop (if it's an array for multi-select)
  // Or if you have an `initialSelectedValues` prop for multi-select
  /*
  useEffect(() => {
    if (multiSelect && Array.isArray(initialSelectedValues)) {
      setLocalSelectedRows(initialSelectedValues);
    }
  }, [initialSelectedValues, multiSelect]);
  */

  const handleSelectedCheckbox = (rowId) => {
    if (multiSelect) {
      setLocalSelectedRows((prev) => {
        const alreadySelected = prev.includes(rowId);
        const updated = alreadySelected
          ? prev.filter((id) => id !== rowId)
          : [...prev, rowId];
        return updated;
      });
    } else {
      setLocalSelectedRowId(rowId);
    }
  };

  // Effect to notify the context when localSelectedRowId changes (single select)
  useEffect(() => {
    if (!hasData) return;
    if (!multiSelect) {
      selectItem(localSelectedRowId);
    }
  }, [localSelectedRowId, multiSelect, selectItem]); // Dependencies: local state, multiSelect mode, and the context function

  // Effect to notify the context when localSelectedRows changes (multi-select)
  useEffect(() => {
    if (!hasData) return;
    if (multiSelect) {
      selectMultiple(localSelectedRows);
    }
  }, [localSelectedRows, multiSelect, selectMultiple]); // Dependencies: local state, multiSelect mode, and the context function

  useEffect(() => {
    if (Array.isArray(dataList) && dataList.length > 0) {
      setRowList(dataList);
    } else {
      setRowList([]);
    }
  }, [dataList]);

  const headers = useMemo(() => {
    // Ensure rowList[0] exists before accessing it
    return Array.isArray(rowList) &&
      rowList.length > 0 &&
      Array.isArray(rowList[0])
      ? rowList[0]
      : [];
  }, [rowList]);

  const hasData = rowList.length > 1;

  return (
    <StyledTableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
            <TableCellHeader key="selecionar">Seleccionar</TableCellHeader>
            {headers.map((nameHeader, index) => (
              <TableCellHeader key={`header-${index}`}>
                {nameHeader}
              </TableCellHeader>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {hasData ? (
            rowList.map((filaTabla, index) => {
              if (index === 0) return null; // Skip header row if it's part of dataList

              const rowId = filaTabla?.[selectedValue] ?? null; // Use selectedValue to identify the row ID
              const isSelected = multiSelect
                ? localSelectedRows.includes(rowId)
                : localSelectedRowId === rowId;

              return (
                <TableRow key={`row-${rowId || index}`}>
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleSelectedCheckbox(rowId)}
                      color="primary"
                    />
                  </TableCell>

                  {/* Render other table cells */}
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
                        {cell || ' '}
                      </TableCell>
                    ) : null
                  )}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length + 1} align="center">
                <NoDataComponent />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default React.memo(ListaTablaSelect);
