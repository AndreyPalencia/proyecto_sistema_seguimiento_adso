import { createContext, useState, useContext } from "react";

const SidebarContext = createContext();

/**
 * SidebarProvider:
 * Proveedor de contexto que permite compartir el estado de la visibilidad
 * del sidebar y su función para alternarlo en cualquier componente hijo.
 */

// context creado para poder acceder a los valores de context
export const SidebarProvider = ({ children }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  // Función para alternar la visibilidad del sidebar
  const toggleSidebar = () => {
    setSidebarVisible((visible) => !visible);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarVisible, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

/**
 * useSidebar:
 * - Hook personalizado para acceder al estado y funciones del contexto del sidebar
 * - Lanza un error si se usa fuera del SidebarProvider.
 */

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebar debe estar dentro del proveedor SidebarProvider"
    );
  }
  return context;
};
