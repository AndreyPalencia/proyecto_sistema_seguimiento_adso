import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePagination } from '../../context/PaginadorContext.jsx';
import { Paginador } from './Paginador/Paginador.jsx';
import CuadroTabla from './CuadroTabla/CuadroTabla.jsx';

/**
 * Componente `TablaContainer`
 * Procesa y muestra una tabla con paginación.
 *
 * @param {Object} props - Props del componente.
 * @param {Array<Object>} props.dataList - Lista de datos a mostrar.
 * @param {Object} props.gridOptions - Configuración específica para la visualización en cuadrícula.
 * @param {Array<string>} props.dataException - Lista de claves que se deben excluir al formatear la cabecera.
 * @param {string} props.filterSearch - Nombre del campo de los datos que se usará para aplicar el filtro.
 *
 * @example
 * // Ejemplo de uso:
 * const dataList = [
 *   { id: 1, nombre: 'Juan', edad: 30, correo: 'juan@example.com' },
 *   { id: 2, nombre: 'María', edad: 25, correo: 'maria@example.com' }
 * ];
 * const gridOptions = { title: 'Titulo', subtitle: 'Subtitulo' }; // Opciones de cuadrícula
 * const dataException = ['edad']; // No mostrar la columna "correo"
 *
 * <TablaContainer dataList={dataList} gridOptions={gridOptions} dataException={dataException} />
 *
 * @returns {JSX.Element} Componente que muestra la tabla y el paginador.
 */
const TablaContainerViewGrid = ({
  dataList,
  dataException,
  selectedValue,
  header,
  gridOptions,
  actionAdd,
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
      {/* Renderizamos la vista según el estado */}
      {/* {console.log(tablaData, dataList)} */}
      <CuadroTabla
        dataList={tablaData}
        dataException={dataException}
        selectedValue={selectedValue}
        gridOptions={gridOptions}
        actionAdd={actionAdd}
      />

      {/* Renderiza el componente Paginador si isPaginador es true y hay datos */}
      {isPaginador && dataRows.length > 0 ? <Paginador /> : null}
    </>
  );
};

export default TablaContainerViewGrid;
