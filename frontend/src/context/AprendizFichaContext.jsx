import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';

// Crear el contexto
const AprendizFichaContext = createContext();

export const AprendizFichaProvider = ({ children }) => {
  // Estado para los valores de id
  const [idAprendiz, setIdAprendiz] = useState(null);
  const [idEmpresa, setIdEmpresa] = useState(null);
  const [idAprendizFicha, setIdAprendizFicha] = useState(null);
  const [idFicha, setIdFicha] = useState(null);

  // Funciones de actualización, memorizadas con useCallback
  const setEmpresaSeleccionada = useCallback((empresaId) => {
    setIdEmpresa(empresaId);
  }, []);

  const setAprendizFichaSeleccionada = useCallback((fichaAprendizId) => {
    setIdAprendizFicha(fichaAprendizId);
  }, []);

  const setFichaSeleccionada = useCallback((fichaId) => {
    setIdFicha(fichaId);
    return fichaId
  }, []);

  const setAprendiz = useCallback((idAprendiz) => {
    setIdAprendiz(idAprendiz);
  }, []);

  const resetearTodo = useCallback(() => {
    setIdAprendiz(null);
    setIdEmpresa(null);
    setIdAprendizFicha(null);
    setIdFicha(null);
  }, []);


  // Memorizar los valores del contexto con useMemo para evitar cálculos innecesarios
  const contextValues = useMemo(
    () => ({
      idAprendiz,
      idFicha,
      idEmpresa,
      idAprendizFicha,
      setEmpresaSeleccionada,
      setAprendizFichaSeleccionada,
      setFichaSeleccionada,
      setAprendiz,
      resetearTodo
    }),
    [idAprendiz, idFicha, idEmpresa, idAprendizFicha]
  );

  // Proveer el contexto con los valores memorizados y las funciones optimizadas
  return (
    <AprendizFichaContext.Provider value={contextValues}>
      {children}
    </AprendizFichaContext.Provider>
  );
};

// Hook para usar el contexto en cualquier componente
export const useAprendizFicha = () => {
  const context = useContext(AprendizFichaContext);
  if (!context) {
    throw new Error(
      'useAprendizFicha debe ser utilizado dentro de un AprendizFichaProvider'
    );
  }
  return context;
};
