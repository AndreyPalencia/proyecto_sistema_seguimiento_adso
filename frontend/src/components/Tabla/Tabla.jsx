import { TablaProvider } from '../../context/TablaContext.jsx';
import { PaginadorProvider } from '../../context/PaginadorContext.jsx';

import TablaContainer from './TablaContainer.jsx';

import { Divider } from '@mui/material';
import TablaController from './TablaController/TablaController.jsx';
import TablaContainerSelect from './TablaContainerSelect.jsx';
import TablaContainerLista from './TablaContainerLista.jsx';
import TablaContainerSelectCheckBox from './TablaContainerSelectCheckBox.jsx';
import TablaContainerViewGrid from './TablaContainerViewGrid.jsx';
import TablaContainerCheckBoxGrid from './TablaContainerCheckBoxGrid.jsx';
import TablaContainerCheckBox from './TablaContainerCheckBox.jsx';

/**
 * Componente `Tabla`
 *
 * Este componente renderiza una tabla con opciones de visualización en lista o cuadrícula,
 * junto con navegación y paginación. Permite aplicar filtros, realizar búsquedas y navegar
 * por los datos en varias páginas.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Array<Object>} props.data - Lista de objetos que se iteran para mostrar en la tabla.
 * @param {Object} props.gridOptions - Configuración específica para la visualización en cuadrícula (grid).
 * @param {Array<string>} props.dataException - Lista de claves que definen las columnas que no se deben mostrar en la tabla.
 * @param {Object} props.filters - Objeto que contiene los parámetros de filtrado de la tabla.
 * @param {Object} props.filters.filter - Conjunto de categorías de filtro y sus valores asociados.
 *                                        Cada clave representa una categoría (por ejemplo, `activas`, `archivadas`),
 *                                        y su valor define el criterio de filtrado correspondiente.
 * @param {string} props.filters.filterSearch - Nombre del campo de los datos que se usará para aplicar el filtro.
 * @param {*} props.filters.defaultValuefilterSearch - Valor inicial que se aplicará al filtro al cargar la tabla.
 *                                                     Debe coincidir con uno de los valores definidos en `filter`.
 * @param {*} props.selectedValue - Valor seleccionado actualmente para el filtro de búsqueda.
 * @param {string} props.variant - Variante de visualización (por ejemplo, "grid" o "list").
 *
 * @example
 * // Ejemplo de uso:
 * const fichas = [
 *   { idFicha: 1, estadoFicha: 1, nombrePrograma: 'Programa A', idInstructor: 101 },
 *   { idFicha: 2, estadoFicha: 0, nombrePrograma: 'Programa B', idInstructor: 102 }
 * ];
 * const gridOptions = { title: 'numeroFicha', subtitle: 'nombrePrograma' };
 * const dataException = ["idFicha", "estadoFicha", "idInstructor"]; // No mostrar estas columnas
 * const filters = {
 *   filter: { todas: '', activas: 1, archivadas: 0 },
 *   filterSearch: 'estadoFicha',  // Filtra usando el campo `estadoFicha`
 *   defaultValuefilterSearch: 1   // El valor predeterminado es 1 (activas)
 * };
 *
 * <Tabla data={fichas} gridOptions={gridOptions} dataException={dataException} filters={filters} />
 *
 * @returns {JSX.Element} - Devuelve la tabla con las opciones de visualización y navegación,
 *                          incluyendo los filtros aplicados y la paginación.
 */

const Tabla = ({
  data,
  gridOptions,
  dataException,
  filters,
  selectedValue,
  header,
  buttonAction,
  extraActions,
  rowActions,
}) => {
  const { filter, filterSearch, defaultValuefilterSearch } = filters;
  return (
    <>
      <TablaController
        filters={filter}
        defaultValuefilterSearch={defaultValuefilterSearch}
        buttonAction={buttonAction}
      />
      <Divider sx={{ margin: '10px 0 20px 0' }} />
      <TablaContainer
        dataList={data}
        gridOptions={gridOptions}
        dataException={dataException}
        filterSearch={filterSearch}
        selectedValue={selectedValue}
        header={header}
        extraActions={extraActions}
        rowActions={rowActions}
      />
    </>
  );
};

export const TablaCheckBox = ({
  data,
  gridOptions,
  dataException,
  filters,
  selectedValue,
  header,
  initialValue,
  buttonAction,
  extraActions,
  rowActions,
  formatCellValue,
}) => {
  const { filter, filterSearch, defaultValuefilterSearch } = filters;
  return (
    <>
      <TablaController
        filters={filter}
        defaultValuefilterSearch={defaultValuefilterSearch}
        buttonAction={buttonAction}
      />
      <Divider sx={{ margin: '10px 0 20px 0' }} />
      <TablaContainerCheckBox
        dataList={data}
        gridOptions={gridOptions}
        dataException={dataException}
        filterSearch={filterSearch}
        selectedValue={selectedValue}
        header={header}
        initialValue={initialValue}
        extraActions={extraActions}
        rowActions={rowActions}
        formatCellValue={formatCellValue}
      />
    </>
  );
};

export const TablaSelect = ({
  data,
  dataException,
  selectedValue,
  header,
  multiSelect,
}) => {
  return (
    <>
      <TablaContainerSelect
        dataList={data}
        dataException={dataException}
        selectedValue={selectedValue}
        header={header}
        multiSelect={multiSelect}
      />
    </>
  );
};

export const TablaLista = ({
  data,
  dataException,
  selectedValue,
  header,
  extraActions,
  rowActions,
  formatCellValue,
}) => {
  return (
    <>
      <TablaContainerLista
        dataList={data}
        dataException={dataException}
        selectedValue={selectedValue}
        header={header}
        extraActions={extraActions}
        rowActions={rowActions}
        formatCellValue={formatCellValue}
      />
    </>
  );
};

export const TablaViewGrid = ({
  data,
  dataException,
  selectedValue,
  header,
  gridOptions,
  buttonAction,
  extraActions,
  rowActions,
}) => {
  return (
    <>
      <TablaContainerViewGrid
        dataList={data}
        dataException={dataException}
        selectedValue={selectedValue}
        header={header}
        gridOptions={gridOptions}
        buttonAction={buttonAction}
        extraActions={extraActions}
        rowActions={rowActions}
      />
    </>
  );
};

export const TablaListaCheckBox = ({
  data,
  dataException,
  selectedValue,
  header,
  initialValue,
  extraActions,
  rowActions,
}) => {
  return (
    <>
      <TablaContainerSelectCheckBox
        dataList={data}
        dataException={dataException}
        selectedValue={selectedValue}
        header={header}
        initialValue={initialValue}
        extraActions={extraActions}
        rowActions={rowActions}
      />
    </>
  );
};

export const TablaGridListSelect = ({
  data,
  gridOptions,
  dataException,
  filters,
  selectedValue,
  header,
  buttonAction,
  initialValue,
  extraActions,
  rowActions,
}) => {
  const { filter, filterSearch, defaultValuefilterSearch } = filters;
  return (
    <>
      <TablaController
        filters={filter}
        defaultValuefilterSearch={defaultValuefilterSearch}
        buttonAction={buttonAction}
      />
      <Divider sx={{ margin: '10px 0 20px 0' }} />
      <TablaContainerCheckBoxGrid
        dataList={data}
        dataException={dataException}
        filterSearch={filterSearch}
        selectedValue={selectedValue}
        header={header}
        initialValue={initialValue}
        gridOptions={gridOptions}
        extraActions={extraActions}
        rowActions={rowActions}
      />
    </>
  );
};
export default Tabla;
