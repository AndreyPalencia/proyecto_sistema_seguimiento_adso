import ListaTabla from './ListaTabla/ListaTabla.jsx';
import CuadroTabla from './CuadroTabla/CuadroTabla.jsx';
import { useTabla } from '../../context/TablaContext.jsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePagination } from '../../context/PaginadorContext.jsx';
import { Paginador } from './Paginador/Paginador.jsx';
import { useFilterButtons } from '../../context/FilterButtonsContext.jsx';

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
const TablaContainer = ({
  dataList,
  gridOptions,
  dataException,
  filterSearch, // Corregido: ahora coincide con la prop que se pasa desde Tabla.jsx
  selectedValue,
  header,
  getRowActions
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

  // /**
  //  * Procesa y formatea las cabeceras de la tabla.
  //  *
  //  * @param {Array<Object>} data - Lista de objetos que contienen los datos.
  //  * @returns {Array} Array donde el primer elemento es la lista de cabeceras formateadas y el resto son las filas.
  //  */
  // const handleHeaderTable = useCallback(
  //   (data) => {
  //     if (!data || data.length === 0) return [];

  //     const headers = Object.keys(data[0]);

  //     const headerWord = headers.filter(
  //       (header) =>
  //         !dataException.some((exception) => header.includes(exception))
  //     ); // Eliminar las palabras de dataException

  //     //Formatea cada cabecera en PascalCase separando las palabras.
  //     const formattedHeader = headerWord.map((header) => {
  //       return header
  //         .split(/(?=[A-Z])/)
  //         .map((word, index) => {
  //           // Si la palabra no está en dataException, procesarla
  //           return index > 0
  //             ? word.toLowerCase() // Convertir a minúsculas si no es la primera palabra
  //             : `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`; // Capitalizar la primera palabra
  //         })
  //         .filter((word) => word !== null) // Eliminar palabras null (aquellas que están en dataException)
  //         .join(' '); // Unir las palabras formateadas en una cadena
  //     });
  //     return [formattedHeader, ...data];
  //   },
  //   [dataException]
  // );

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
      {/* Solo mostrar debug en desarrollo */}
      {/* {console.log('Data recibida:', dataList)}
      {console.log('Data formateada:', dataFormat)}
      {console.log('Tabla final:', tablaData)} */}

      {/* Renderizamos la vista según el estado */}
      {isTablaList ? (
        <ListaTabla
          dataList={tablaData}
          dataException={dataException}
          selectedValue={selectedValue}
          getRowActions={getRowActions}
        />
      ) : (
        <CuadroTabla
          dataList={tablaData}
          gridOptions={gridOptions}
          selectedValue={selectedValue}
          getRowActions={getRowActions}
        />
      )}

      {/* Renderiza el componente Paginador si isPaginador es true y hay datos */}
      {isPaginador && dataRows.length > 0 ? <Paginador /> : null}
    </>
  );
};

export default TablaContainer;
