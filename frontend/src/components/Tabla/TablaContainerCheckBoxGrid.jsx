import { useEffect, useState, useCallback, useMemo } from 'react';
import { usePagination } from '../../context/PaginadorContext.jsx';
import { Paginador } from './Paginador/Paginador.jsx';
import ListaTablaCheckBox from './ListaTabla/ListaTablaCheckBox.jsx';
import { useTabla } from '../../context/TablaContext.jsx';
import CuadroTabla from './CuadroTabla/CuadroTabla.jsx';
import { useFilterButtons } from '../../context/FilterButtonsContext.jsx';
/**
 * Componente `TablaList`
 * Procesa y muestra una tabla con paginación y cabeceras siempre visibles, incluso si no hay datos.
 *
 * @param {Object} props - Props del componente.
 * @param {Array<Object>} props.dataList - Lista de datos a mostrar.
 * @param {Array<string>} props.dataException - Lista de claves que se deben excluir al formatear la cabecera.
 * @param {Array<string>} props.header - Cabeceras de la tabla pasadas como propiedad.
 * @param {string} props.selectedValue - Valor seleccionado en la tabla.
 *
 * @returns {JSX.Element} Componente que muestra la tabla y el paginador.
 */
const TablaContainerCheckBoxGrid = ({
  dataList,
  dataException,
  selectedValue,
  header,
  initialValue,
  gridOptions,
  filterSearch,
}) => {
  const { isTablaList } = useTabla();
  //Se usa el contexto de paginación
  const {
    isPaginador,
    switchPaginador,
    currentPage,
    rowsPerPage,
    handleTotalRows,
  } = usePagination();

  //Se obtine el valor del filtro y si esta activo
  const { filterFlagButtons, filterActiveButtons } = useFilterButtons();

  const [dataFormat, setDataFormat] = useState([]);

  /**
   * Filtra los datos según el filtro activo.
   *
   * @param {Array<Object>} data - Lista de objetos que contienen los datos.
   * @returns {Array} Datos filtrados según el criterio activo.
   */
  const filterData = useCallback(
    (data) => {
      if (!filterFlagButtons) return data;
      if (filterActiveButtons === '') return data; // No se filtra nada, todos los datos se muestran

      // Asegurarse de que filterSearch existe antes de usarlo
      if (!filterSearch) return data;

      // Retornar explícitamente el resultado filtrado
      return data.filter((item) => {
        return item[filterSearch] == filterActiveButtons;
      });
    },
    [filterFlagButtons, filterActiveButtons, filterSearch]
  );

  /**
   * Memoriza el formato de datos paginados.
   * Separa las cabeceras y filas, y aplica la paginación según la página actual y filas por página.
   *
   * @returns {Object} Objeto con las propiedades: headers, dataRows y paginatedData.
   */

  const formatPaginatedData = useMemo(() => {
    if (!dataFormat || dataFormat.length === 0)
      return {
        headers: [],
        dataRows: [],
        paginatedData: [],
      };

    const dataRows = dataFormat; //Extraemos las filas de las headers
    const pageIndex = currentPage - 1;
    const paginatedData = dataRows.slice(
      pageIndex * rowsPerPage,
      pageIndex * rowsPerPage + rowsPerPage
    );

    return {
      dataRows,
      paginatedData,
    };
  }, [dataFormat, currentPage, rowsPerPage, header]);

  /**
   * Procesa la data de la tabla aplicando el formateo de cabeceras y filtros.
   */
  const processDataTable = useCallback(() => {
    // Verificar si dataList es válido
    if (!dataList || dataList.length === 0) {
      setDataFormat([]);
      return;
    }

    const filteredRows = filterData(dataList);

    setDataFormat(filteredRows);
  }, [dataList, header, filterData]);

  //Extraemos las propiedes de vueltas por formatPaginatedData
  const { dataRows, paginatedData } = formatPaginatedData;

  //Actualiza el total de filas en el contexto cuando cambian los datos.
  useEffect(() => {
    if (dataRows.length > 0) {
      handleTotalRows(dataRows.length);
    }
  }, [dataRows.length, handleTotalRows]);

  //Procesa la data cada vez que cambien los filtros o datos relevantes
  useEffect(() => {
    processDataTable();
  }, [
    filterFlagButtons,
    filterActiveButtons,
    filterSearch,
    dataList,
    processDataTable,
  ]);

  //Verifica y activa el paginador si hay más de dos filas de datos.
  useEffect(() => {
    if (dataRows.length > 2 && !isPaginador) {
      switchPaginador(true);
    }
  }, [dataRows.length, isPaginador, switchPaginador]);

  //Concatena cabeceras y datos paginados para formar la data final a mostrar.
  const tablaData = useMemo(() => {
    return header && paginatedData.length > 0
      ? [header, ...paginatedData]
      : [header];
  }, [header, paginatedData]);

  return (
    <>
      {isTablaList ? (
        <ListaTablaCheckBox
          dataList={tablaData}
          dataException={dataException}
          selectedValue={selectedValue}
          initialValue={initialValue}
        />
      ) : (
        <CuadroTabla
          dataList={tablaData}
          gridOptions={gridOptions}
          selectedValue={selectedValue}
        />
      )}

      {isPaginador && dataRows.length > 0 ? <Paginador /> : null}
    </>
  );
};

export default TablaContainerCheckBoxGrid;
