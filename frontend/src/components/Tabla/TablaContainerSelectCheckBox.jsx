import { useEffect, useState, useCallback, useMemo } from 'react';
import { usePagination } from '../../context/PaginadorContext.jsx';
import { Paginador } from './Paginador/Paginador.jsx';
import ListaTablaCheckBox from './ListaTabla/ListaTablaCheckBox.jsx';
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
const TablaContainerSelectCheckBox = ({
  dataList,
  dataException,
  selectedValue,
  header,
  initialValue,
}) => {
  // Se usa el contexto de paginación
  const {
    isPaginador,
    switchPaginador,
    currentPage,
    rowsPerPage,
    handleTotalRows,
  } = usePagination();

  const [dataFormat, setDataFormat] = useState([]);

  /**
   * Procesa la data de la tabla aplicando el formateo de cabeceras.
   */
  const processDataTable = useCallback(() => {
    // Verificar si dataList es válido
    if (!dataList || dataList.length === 0) {
      setDataFormat([]);
      return;
    }
    setDataFormat(dataList);
  }, [dataList]); // Depend on dataList only

  /**
   * Memoriza el formato de datos paginados.
   * Separa las cabeceras y filas, y aplica la paginación según la página actual y filas por página.
   *
   * @returns {Object} Objeto con las propiedades: headers, dataRows y paginatedData.
   */
  const formatPaginatedData = useMemo(() => {
    if (!dataFormat || dataFormat.length === 0)
      return {
        dataRows: [],
        paginatedData: [],
      };

    const dataRows = dataFormat; // Extraemos las filas de las headers
    const pageIndex = currentPage - 1;
    const paginatedData = dataRows.slice(
      pageIndex * rowsPerPage,
      pageIndex * rowsPerPage + rowsPerPage
    );

    return {
      dataRows,
      paginatedData,
    };
  }, [dataFormat, header, currentPage, rowsPerPage]);

  //Actualiza el total de filas en el contexto cuando cambian los datos.
  const { dataRows, paginatedData } = formatPaginatedData;

  // Actualiza el total de filas en el contexto cuando cambian los datos.
  useEffect(() => {
    if (dataRows.length > 0) {
      handleTotalRows(dataRows.length);
    }
  }, [dataRows.length, handleTotalRows]);

  // Procesa la data cada vez que cambien los datos relevantes
  useEffect(() => {
    processDataTable();
  }, [processDataTable]);

  // Verifica y activa el paginador si hay más de dos filas de datos.
  useEffect(() => {
    if (dataRows.length > 2 && !isPaginador) {
      switchPaginador(true);
    }
  }, [dataRows.length, isPaginador, switchPaginador]);

  // Concatena cabeceras y datos paginados para formar la data final a mostrar.
  const tablaData = useMemo(() => {
    return header && paginatedData.length > 0
      ? [header, ...paginatedData]
      : [header];
  }, [header, paginatedData]);

  return (
    <>
      <ListaTablaCheckBox
        dataList={tablaData}
        dataException={dataException}
        selectedValue={selectedValue}
        initialValue={initialValue}
      />
      {isPaginador && dataRows.length > 0 ? <Paginador /> : null}
    </>
  );
};

export default TablaContainerSelectCheckBox;
