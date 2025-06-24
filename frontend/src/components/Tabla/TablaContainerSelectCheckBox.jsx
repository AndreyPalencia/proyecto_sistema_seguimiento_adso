import { useTablaLogic } from './hook/useTablaLogic.js';

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
      <ListaTablaCheckBox
        dataList={tablaData}
        dataException={dataException}
        selectedValue={selectedValue}
        initialValue={initialValue}
        extraActions={extraActions}
        rowActions={rowActions}
      />
      {isPaginador && dataRows.length > 0 ? <Paginador /> : null}
    </>
  );
};

export default TablaContainerSelectCheckBox;
