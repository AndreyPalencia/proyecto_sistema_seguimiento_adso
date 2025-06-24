import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePagination } from '../../../context/PaginadorContext.jsx';
import { useFilterButtons } from '../../../context/FilterButtonsContext.jsx';

/**
 * Custom Hook para manejar la lógica común de todas las tablas
 *
 * @param {Object} config - Configuración del hook
 * @param {Array} config.dataList - Lista de datos a procesar
 * @param {string} config.filterSearch - Campo para filtrar (opcional)
 * @param {Array} config.header - Cabeceras de la tabla
 * @param {boolean} config.enableFilters - Si debe usar filtros o no
 *
 * @returns {Object} Objeto con toda la lógica procesada
 */
export const useTablaLogic = ({
  dataList,
  filterSearch = null,
  header,
  enableFilters = false,
}) => {
  // Contextos
  const {
    isPaginador,
    switchPaginador,
    currentPage,
    rowsPerPage,
    handleTotalRows,
  } = usePagination();

  const { filterFlagButtons, filterActiveButtons } = useFilterButtons();

  // Estado local
  const [dataFormat, setDataFormat] = useState([]);

  /**
   * Filtra los datos según el filtro activo.
   * Solo se ejecuta si enableFilters es true
   */
  const filterData = useCallback(
    (data) => {
      // Si no están habilitados los filtros, retorna los datos sin filtrar
      if (!enableFilters) return data;
      if (!filterFlagButtons) return data;
      if (filterActiveButtons === '') return data;
      if (!filterSearch) return data;

      return data.filter((item) => {
        return item[filterSearch] == filterActiveButtons;
      });
    },
    [enableFilters, filterFlagButtons, filterActiveButtons, filterSearch]
  );

  /**
   * Memoriza el formato de datos paginados.
   */
  const formatPaginatedData = useMemo(() => {
    if (!dataFormat || dataFormat.length === 0) {
      return {
        dataRows: [],
        paginatedData: [],
      };
    }

    const dataRows = dataFormat;
    const pageIndex = currentPage - 1;
    const paginatedData = dataRows.slice(
      pageIndex * rowsPerPage,
      pageIndex * rowsPerPage + rowsPerPage
    );

    return {
      dataRows,
      paginatedData,
    };
  }, [dataFormat, currentPage, rowsPerPage]);

  /**
   * Procesa la data de la tabla aplicando filtros si están habilitados
   */
  const processDataTable = useCallback(() => {
    if (!dataList || dataList.length === 0) {
      setDataFormat([]);
      return;
    }

    const filteredRows = filterData(dataList);
    setDataFormat(filteredRows);
  }, [dataList, filterData]);

  // Extraer propiedades del formato paginado
  const { dataRows, paginatedData } = formatPaginatedData;

  // Efectos
  useEffect(() => {
    if (dataRows.length > 0) {
      handleTotalRows(dataRows.length);
    }
  }, [dataRows.length, handleTotalRows]);

  useEffect(() => {
    processDataTable();
  }, [
    // Solo incluir dependencias de filtro si están habilitados
    ...(enableFilters
      ? [filterFlagButtons, filterActiveButtons, filterSearch]
      : []),
    dataList,
    processDataTable,
  ]);

  useEffect(() => {
    if (dataRows.length > 2 && !isPaginador) {
      switchPaginador(true);
    }
  }, [dataRows.length, isPaginador, switchPaginador]);

  // Datos finales de la tabla
  const tablaData = useMemo(() => {
    return header && paginatedData.length > 0
      ? [header, ...paginatedData]
      : [header];
  }, [header, paginatedData]);

  // Retornar todo lo que necesitan los componentes
  return {
    // Datos procesados
    tablaData,
    dataRows,
    paginatedData,

    // Estados de paginación
    isPaginador,

    // Para debugging (opcional)
    dataFormat,
    dataList,
  };
};
