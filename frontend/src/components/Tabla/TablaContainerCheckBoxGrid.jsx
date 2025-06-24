import { useTabla } from '../../context/TablaContext.jsx';

import { useTablaLogic } from './hook/useTablaLogic.js';

import { Paginador } from './Paginador/Paginador.jsx';
import ListaTablaCheckBox from './ListaTabla/ListaTablaCheckBox.jsx';
import CuadroTabla from './CuadroTabla/CuadroTabla.jsx';
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
  extraActions,
  rowActions,
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
      {isTablaList ? (
        <ListaTablaCheckBox
          dataList={tablaData}
          dataException={dataException}
          selectedValue={selectedValue}
          initialValue={initialValue}
          extraActions={extraActions}
          rowActions={rowActions}
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

      {isPaginador && dataRows.length > 0 ? <Paginador /> : null}
    </>
  );
};

export default TablaContainerCheckBoxGrid;
