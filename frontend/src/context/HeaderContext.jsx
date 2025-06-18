import { createContext, useCallback, useContext, useState } from 'react';

/**
 * `HeaderContext`
 *
 * Contexto para gestionar la altura del componente `Header` y calcular dinámicamente
 * la altura del contenido basado en la altura del header.
 * Permite acceder al valor de la altura del header y actualizarla de manera dinámica.
 */
const HeaderContext = createContext();

/**
 * `HeaderProvider`
 *
 * Proveedor del contexto para gestionar la altura del header. Este componente
 * permite obtener y actualizar la altura del header y recalcular la altura del contenido.
 *
 * @param {Object} props - Props del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto.
 *
 * @returns {JSX.Element} - Proveedor de contexto para la altura del header.
 */
export const HeaderProvider = ({ children }) => {
  // Inicialización del estado de la altura del header (valor inicial 70px)
  const [headerHeight, setHeaderHeight] = useState(70);

  /**
   * Función para actualizar la altura del header.
   *
   * @param {number} newHeight - Nueva altura para el header en píxeles.
   * 
   * @returns {void}
   */
  const handleResize = useCallback((newHeight) => {
    setHeaderHeight(newHeight);
  }, []);

  return (
    <HeaderContext.Provider value={{ headerHeight, handleResize }}>
      {children}
    </HeaderContext.Provider>
  );
};

/**
 * `useHeader`
 *
 * Hook para acceder al contexto de la altura del header. Este hook debe ser
 * utilizado dentro de un componente envuelto en `HeaderProvider`.
 *
 * @returns {Object} Estado y funciones del contexto de la altura del header.
 * @property {number} headerHeight - Altura actual del header en píxeles.
 * @property {Function} handleResize - Función para actualizar la altura del header.
 * @throws {Error} Lanza un error si se usa fuera de `HeaderProvider`.
 */
export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error(
      'useHeader debe ser utilizado dentro del proveedor HeaderProvider'
    );
  }
  return context;
};
