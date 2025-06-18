import { createContext, useContext, useState } from 'react';

// Crear el contexto
export const UserContext = createContext();

// Proveedor del contexto
export const UserFichaAprendizProvider = ({ children }) => {
  const [idEmpresa, setIdEmpresa] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const [idFicha, setIdFicha] = useState(null); // 🔹 Agregamos idFicha

  const handleIdEmpresa = (idEmpresa) => {
    if (typeof idEmpresa === 'number') {
      setIdEmpresa(idEmpresa);
    }
    throw new Error('idEmpresa debe ser un número');
  };

  const handleIdUsuario = (idUsuario) => {
    if (typeof idUsuario === 'number') {
      setIdUsuario(idUsuario);
    }
    throw new Error('idUsuario debe ser un número');
  };

  const handleIdFicha = (idFicha) => {
    if (typeof idFicha === 'number') {
      setIdFicha(idFicha);
    }
    throw new Error('idFicha debe ser un número');
  };

  return (
    <UserContext.Provider
      value={{
        idEmpresa,
        handleIdEmpresa,
        idUsuario,
        handleIdUsuario,
        idFicha,
        handleIdFicha,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar el contexto en cualquier componente
export const useUserFichaAprendiz = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAppContext debe ser utilizado dentro de useContext');
  }
};
