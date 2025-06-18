import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const CheckboxContext = createContext();

export const CheckboxProvider = ({ children }) => {
  const [selectedId, setSelectedId] = useState(null); // selección única
  const [selectedIds, setSelectedIds] = useState([]); // selección múltiple

  // Selección única
  const selectItem = useCallback((id) => {
    setSelectedId(id);
  }, []);

  // Selección múltiple
  const selectMultiple = useCallback((idsArray) => {
    setSelectedIds(idsArray);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
    setSelectedIds([]);
  }, []);

  const contextValue = useMemo(
    () => ({
      selectedId,
      selectedIds,
      selectItem,
      selectMultiple,
      clearSelection,
    }),
    [selectedId, selectedIds, selectItem, selectMultiple, clearSelection]
  );

  return (
    <CheckboxContext.Provider value={contextValue}>
      {children}
    </CheckboxContext.Provider>
  );
};

export const useCheckbox = () => {
  const context = useContext(CheckboxContext);
  if (!context) {
    throw new Error('useCheckbox debe usarse dentro de un CheckboxProvider');
  }
  return context;
};
