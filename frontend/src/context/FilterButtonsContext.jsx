import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

/**
 * `FilterButtonsContext`
 *
 * Contexto para gestionar los filtros de botones. Permite acceder al estado de los filtros aplicados,
 * si los filtros están activos, y el filtro actualmente seleccionado. Además, proporciona funciones
 * para actualizar dichos valores.
 */
const FilterButtonsContext = createContext();

/**
 * `FilterButtonsProvider`
 *
 * Proveedor del contexto para gestionar los filtros de botones. Este componente
 * proporciona acceso y actualización de los filtros, incluyendo su estado, si están activos
 * y qué filtro está actualmente seleccionado.
 *
 * @param {Object} props - Props del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto de filtros.
 *
 * @returns {JSX.Element} - Proveedor de contexto para los filtros de botones.
 */
export const FilterButtonsProvider = ({ children }) => {
  // Estado que almacena los filtros aplicados (inicialmente vacío)
  const [filterButtons, setFilterButtons] = useState({});

  // Estado que indica si los filtros están habilitados o no
  const [filterFlagButtons, setFilterFlagButtons] = useState(false);

  // Estado que almacena el filtro actualmente activo
  const [filterActiveButtons, setFilterActiveButtons] = useState('');

  /**
   * Función para actualizar los filtros aplicados.
   *
   * @param {Object} newValue - Un objeto con los nuevos filtros aplicados.
   */
  const handleFilterButtons = useCallback((newValue) => {
    setFilterButtons(newValue);
  }, []);

  /**
   * Función para actualizar si los filtros están habilitados.
   *
   * @param {boolean} value - Nuevo valor de la bandera de filtros (true/false).
   */
  const handleFilterFlagButtons = useCallback((value) => {
    setFilterFlagButtons(value);
  });

  /**
   * Función para actualizar el filtro activo.
   *
   * @param {string} valueName - Valor del filtro actualmente activo.
   */
  const handleFilterActiveButtons = useCallback((valueName) => {
    setFilterActiveButtons(valueName);
  }, []);

  // Memoiza los valores y las funciones de los filtros para evitar recalculos innecesarios
  const filters = useMemo(
    () => ({
      filterButtons,
      filterFlagButtons,
      filterActiveButtons,
      handleFilterButtons,
      handleFilterFlagButtons,
      handleFilterActiveButtons,
    }),
    [filterButtons, handleFilterButtons, handleFilterFlagButtons]
  );

  return (
    <FilterButtonsContext.Provider value={filters}>
      {children}
    </FilterButtonsContext.Provider>
  );
};

/**
 * `useFilterButtons`
 *
 * Hook para acceder al contexto de los filtros de botones. Este hook debe ser
 * utilizado dentro de un componente que esté envuelto por `FilterButtonsProvider`.
 *
 * @returns {Object} Estado y funciones del contexto de filtros de botones.
 * @property {Object} filterButtons - Filtros aplicados actualmente.
 * @property {boolean} filterFlagButtons - Indica si los filtros están habilitados.
 * @property {string} filterActiveButtons - Nombre del filtro actualmente activo.
 * @property {Function} handleFilterButtons - Función para actualizar los filtros aplicados.
 * @property {Function} handleFilterFlagButtons - Función para actualizar la bandera de filtros.
 * @property {Function} handleFilterActiveButtons - Función para actualizar el filtro activo.
 * @throws {Error} Lanza un error si se usa fuera de `FilterButtonsProvider`.
 */
export const useFilterButtons = () => {
  const context = useContext(FilterButtonsContext);
  if (!context) {
    throw new Error(
      'useFilterButtons debe ser utilizado dentro del proveedor FilterButtonsProvider'
    );
  }
  return context;
};
