import React from 'react';
import { TablePagination } from '@mui/material';
import { usePagination } from '../../../context/PaginadorContext';

/**
 * Componente `Paginador`
 * Renderiza el paginador usando el componente TablePagination de Material UI.
 *
 * Se encarga de mostrar la paginación y gestionar el cambio de página y la cantidad
 * de filas por página.
 *
 * Nota: TablePagination utiliza base cero para la propiedad "page", por lo que se
 * ajusta currentPage (1-indexed) restándole 1 en la visualización.
 *
 * @returns {JSX.Element} Componente de paginación.
 */
export const Paginador = () => {
  const {
    currentPage,
    handlePageChange,
    rowsPerPage,
    totalRows,
    handleRowsPerPageChange,
  } = usePagination();

  return (
    <TablePagination
      component="div"
      rowsPerPageOptions={[5, 10, 25, 50, 100]}
      labelRowsPerPage={'Filas por pagina'}
      labelDisplayedRows={({ from, to, count }) => `${from} - ${to} de ${count !== -1 ? count : `más de ${to}`}`}
      count={totalRows}
      page={parseInt(currentPage - 1)}
      onPageChange={(event, newPage) => handlePageChange(event, newPage + 1)}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleRowsPerPageChange} // Permitir cambiar la cantidad de filas por página
    />
  );
};