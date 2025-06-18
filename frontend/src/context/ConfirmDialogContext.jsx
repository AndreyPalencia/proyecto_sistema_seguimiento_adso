import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog';

/**
 * `ConfirmDialogContext`
 *
 * Contexto para manejar la lógica del cuadro de diálogo de confirmación.
 * Proporciona una función `showConfirm` que permite mostrar un cuadro de confirmación
 * con un título, un mensaje, y una acción al confirmar.
 */
const ConfirmDialogContext = createContext();

/**
 * `ConfirmDialogProvider`.
 * Proveedor del contexto de dialogo de confirmación. Encapsula el componente `ConfirmDialog` y provee la función `showConfirm` a los hijos.
 *
 * @param {Object} props - Propiedades del proveedor.
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto.
 *
 * @returns {JSX.Element} - El proveedor con el contexto y el diálogo de confirmación.
 */
export const ConfirmDialogProvider = ({ children }) => {
  //Estado para almacenar los datos del cuadro de diálogo de confirmación.
  const [dialogData, setDialogData] = useState({
    open: false,
    title: '',
    content: '',
    onConfirm: () => {},
  });

  /**
   * Muestra el cuadro de diálogo de confirmación con los datos especificados.
   *
   * @param {Object} param - Objeto con los datos del diálogo.
   * @param {string} param.title - Título del cuadro de diálogo.
   * @param {string} param.content - Contenido del mensaje del cuadro de diálogo.
   * @param {Function} param.onConfirm - Función a ejecutar si el usuario confirma.
   */
  const showConfirm = useCallback(({ title, content, onConfirm }) => {
    setDialogData({
      open: true,
      title,
      content,
      onConfirm,
    });
  }, []);

  /**
   * Cierra el cuadro de diálogo sin ejecutar ninguna acción.
   * @returns {void}
   */
  const handleClose = useCallback(() => {
    setDialogData((prev) => ({ ...prev, open: false }));
  }, []);

  /**
   * Ejecuta la función `onConfirm` si existe y luego cierra el cuadro de diálogo.
   * @returns {void}
   */
  const handleConfirm = useCallback(() => {
    if (typeof dialogData.onConfirm === 'function') {
      dialogData.onConfirm();
    }
    handleClose();
  }, [dialogData.onConfirm, handleClose]);

  // Keyboard event listener to trigger confirm on "Enter"
  // useEffect(() => {
  //   const handleKeyPress = (event) => {
  //     if (event.key === 'Enter' && dialogData.open) {
  //       handleConfirm(); // Trigger confirmation when Enter is pressed
  //     }
  //   };

  //   window.addEventListener('keydown', handleKeyPress);

  //   return () => {
  //     window.removeEventListener('keydown', handleKeyPress);
  //   };
  // }, [dialogData.open, handleConfirm]);

  //Memorizar el valor del contexto para evitar renders innecesarios
  const contextValue = useMemo(
    () => ({
      showConfirm,
    }),
    [showConfirm]
  );

  return (
    <ConfirmDialogContext.Provider value={contextValue}>
      <ConfirmDialog
        open={dialogData.open}
        title={dialogData.title}
        content={dialogData.content}
        onConfirm={handleConfirm}
        onCancel={handleClose}
      />
      {children}
    </ConfirmDialogContext.Provider>
  );
};

/**
 * `useConfirmDialog`
 *
 * Hook para acceder al contexto del cuadro de diálogo de confirmación. Este hook debe ser
 * utilizado dentro de un componente que esté envuelto por `ConfirmDialogProvider`.
 *
 * @returns {Object} Estado y funciones del contexto de confirmación.
 * @property {Function} showConfirm - Función para mostrar el cuadro de diálogo de confirmación.
 *   Recibe un objeto con las propiedades:
 *   - `title` {string}: Título del diálogo.
 *   - `content` {string}: Contenido o mensaje del diálogo.
 *   - `onConfirm` {Function}: Función que se ejecuta al confirmar.
 *
 * @throws {Error} Lanza un error si se usa fuera de `ConfirmDialogProvider`.
 */
export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error(
      'useConfirmDialog debe ser utilizado dentro del proveedor ConfirmDialogProvider'
    );
  }
  return context;
};
