import { useTabla } from '../../context/TablaContext.jsx';

import { useTablaLogic } from './hook/useTablaLogic.js';

import ListaTablaCheckBox from './ListaTabla/ListaTablaCheckBox.jsx';
import CuadroTabla from './CuadroTabla/CuadroTabla.jsx';
import { Paginador } from './Paginador/Paginador.jsx';

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
const TablaContainerCheckBox = ({
  dataList,
  gridOptions,
  dataException,
  filterSearch, // Corregido: ahora coincide con la prop que se pasa desde Tabla.jsx
  selectedValue,
  header,
  initialValue,
  extraActions,
  rowActions,
  formatCellValue,
}) => {
  const { isTablaList } = useTabla();

  // Usar el hook personalizado con filtros habilitados
  const { tablaData, dataRows, isPaginador } = useTablaLogic({
    dataList,
    filterSearch,
    header,
    enableFilters: true, // Este componente usa filtros
  });

  return (
    <>
      {/* Solo mostrar debug en desarrollo */}
      {/* {console.log('Data recibida:', dataList)}
      {console.log('Data formateada:', dataFormat)}
      {console.log('Tabla final:', tablaData)} */}

      {/* Renderizamos la vista según el estado */}
      {isTablaList ? (
        <ListaTablaCheckBox
          dataList={tablaData}
          dataException={dataException}
          selectedValue={selectedValue}
          extraActions={extraActions}
          initialValue={initialValue}
          rowActions={rowActions}
          formatCellValue={formatCellValue}
        />
      ) : (
        <CuadroTabla
          dataList={tablaData}
          gridOptions={gridOptions}
          selectedValue={selectedValue}
          extraActions={extraActions}
          rowActions={rowActions}
        />
      )}

      {/* Renderiza el componente Paginador si isPaginador es true y hay datos */}
      {isPaginador && dataRows.length > 0 ? <Paginador /> : null}
    </>
  );
};

export default TablaContainerCheckBox;
