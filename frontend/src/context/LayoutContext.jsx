import { createContext, useContext, useEffect, useState } from 'react';
import { useHeader } from './HeaderContext';

/**
 * `LayoutContext`
 *
 * Contexto para gestionar la altura del contenido principal en función de la
 * altura del header y el tamaño de la ventana. Actualiza dinámicamente
 * el tamaño disponible para el contenido.
 */
const LayoutContext = createContext();

/**
 * `LayoutProvider`
 *
 * Proveedor del contexto que calcula y proporciona la altura disponible
 * para el contenido principal restando la altura del header del alto total
 * de la ventana del navegador.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que usan este contexto
 * @returns {JSX.Element} - Proveedor de contexto
 */
export const LayoutProvider = ({ children }) => {
  const { headerHeight } = useHeader();

  const [contentHeight, setContentHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight - headerHeight : 0
  );

  useEffect(() => {
    const handleWindowResize = () => {
      setContentHeight(window.innerHeight - headerHeight);
    };

    handleWindowResize(); // cálculo inicial

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [headerHeight]);

  return (
    <LayoutContext.Provider value={{ contentHeight }}>
      {children}
    </LayoutContext.Provider>
  );
};

/**
 * `useLayout`
 *
 * Hook para consumir el contexto LayoutContext. Debe usarse dentro
 * de un `LayoutProvider`.
 *
 * @returns {Object} - Estado del contexto con la altura disponible para el contenido
 * @property {number} contentHeight - Altura en píxeles del área de contenido
 */
export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout debe usarse dentro de un LayoutProvider');
  }
  return context;
};
