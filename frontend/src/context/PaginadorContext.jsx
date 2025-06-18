import {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';

/**
 * `PaginadorContext`
 *
 * Contexto para manejar la paginación en la aplicación.
 * Provee estado y funciones para controlar la visibilidad del paginador,
 * la página actual, la cantidad de filas por página y el total de filas.
 */
const PaginadorContext = createContext();

/**
 * `PaginadorProvider`
 *
 * Proveedor del contexto de paginación.
 *
 * @param {Object} props - Props del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que pueden acceder al contexto.
 *
 * @returns {JSX.Element} Componente Provider para la paginación.
 */
export const PaginadorProvider = ({ children }) => {
  //Estado que indica si se muestra el paginador.
  const [isPaginador, setPaginador] = useState(true);
  //Página actual (1-indexed).
  const [currentPage, setCurrentPage] = useState(1);
  //Número de filas por página.
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //Total de filas en la lista.
  const [totalRows, setTotalRows] = useState(0);

  /**
   * Alterna la visibilidad del paginador.
   * 
   * @returns {void}
   */
  const switchPaginador = useCallback(() => {
    setPaginador((visible) => !visible);
  }, []);

  /**
   * Actualiza la página actual.
   *
   * @param {React.SyntheticEvent} event - Evento del cambio de página.
   * @param {number} newPage - Nueva página seleccionada.
   * 
   * @returns {void} 
   */
  const handlePageChange = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);

  /**
   * Actualiza la cantidad de filas por página y reinicia la página a 1.
   *
   * @param {React.ChangeEvent} event - Evento del cambio en el número de filas.
   * 
   * @returns {void}
   */
  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reinicia a la primera página.
  }, []);

  /**
   * Actualiza el total de filas y reinicia la página a 1.
   *
   * @param {number} newValue - Nuevo total de filas.
   * 
   * @returns {void}
   */
  const handleTotalRows = useCallback((newValue) => {
    setTotalRows(newValue);
    setCurrentPage(1); // Reinicia a la primera página.
  }, []);

  //Valor del contexto memorizado para evitar re-renderizados innecesarios.
  const contextValue = useMemo(
    () => ({
      isPaginador,
      switchPaginador,
      currentPage,
      handlePageChange,
      rowsPerPage,
      handleRowsPerPageChange,
      totalRows,
      handleTotalRows,
    }),
    [
      isPaginador,
      switchPaginador,
      currentPage,
      handlePageChange,
      rowsPerPage,
      handleRowsPerPageChange,
      totalRows,
      handleTotalRows,
    ]
  );

  return (
    <PaginadorContext.Provider value={contextValue}>
      {children}
    </PaginadorContext.Provider>
  );
};

/**
 * `usePagination`
 *
 * Hook para acceder al contexto de paginación.
 * Se debe utilizar dentro de un componente que esté dentro de `PaginadorProvider`.
 *
 * @returns {Object} Estado y funciones del paginador.
 * @property {boolean} isPaginador - Indica si se muestra el paginador.
 * @property {number} currentPage - Página actual (comienza en 1).
 * @property {number} rowsPerPage - Número de filas por página.
 * @property {number} totalRows - Total de filas en la lista.
 * @property {Function} switchPaginador - Función para alternar la visibilidad del paginador.
 * @property {Function} handlePageChange - Función para actualizar la página actual.
 * @property {Function} handleRowsPerPageChange - Función para cambiar la cantidad de filas por página.
 * @property {Function} handleTotalRows - Función para actualizar el total de filas.
 *
 * @throws {Error} Lanza un error si el hook se usa fuera de `PaginadorProvider`.
 */
export const usePagination = () => {
  const context = useContext(PaginadorContext);
  if (!context) {
    throw new Error('usePagination debe estar dentro de PaginadorProvider');
  }
  return context;
};
