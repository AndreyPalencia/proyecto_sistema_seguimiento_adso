import { TableCell, TableContainer, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * `StyledTableContainer`
 * Contenedor de la tabla con fondo blanco, bordes redondeados y sombra.
 */
export const StyledTableContainer = styled(TableContainer)({
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

/**
 * `TableHeader`
 * Fila de cabecera de la tabla con fondo gris claro.
 */
export const TableHeader = styled(TableRow)({
  backgroundColor: '#f5f5f5',
});

/**
 * `TableCellHeader`
 * Celda de cabecera con texto en negrita y borde gris.
 */
export const TableCellHeader = styled(TableCell)({
  fontWeight: 'bold',
  borderColor: 'gray',
});

/**
 * `GrayTableCell`
 * Celda con texto en color gris.
 */
export const GrayTableCell = styled(TableCell)({
  color: 'gray',
});
