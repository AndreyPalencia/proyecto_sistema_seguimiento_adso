import { useTablaLogic } from './hook/useTablaLogic.js';

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
  extraActions,
  rowActions,
}) => {
  // Usar el hook personalizado SIN filtros
  const { tablaData, dataRows, isPaginador } = useTablaLogic({
    dataList,
    header,
    enableFilters: false, // Este componente NO usa filtros
  });
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
        extraActions={extraActions}
        rowActions={rowActions}
      />

      {/* Renderiza el componente Paginador si isPaginador es true y hay datos */}
      {isPaginador && dataRows.length > 0 ? <Paginador /> : null}
    </>
  );
};

export default TablaContainerViewGrid;
