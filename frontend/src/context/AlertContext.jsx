import React, {
  act,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { AlertTitle, Fade, Slide, Grow } from '@mui/material';

/**
 * `AlertContext`
 *
 * Contexto global para mostrar alertas (snackbars) desde cualquier componente de la aplicación.
 * Funciona junto con `notistack` y Material UI para mostrar mensajes con estilos y comportamiento personalizados.
 */
const AlertContext = createContext();

/**
 * `InnerAlertProvider`
 *
 * Proveedor interno que utiliza `useSnackbar` para crear una función `showAlert`.
 * Encapsula la lógica de mostrar alertas con mensaje, título, severidad, duración y posición.
 *
 * @param {React.ReactNode} children - Componentes hijos que tendrán acceso al contexto.
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto.
 * @returns {JSX.Element} - Proveedor del contexto con lógica de alerta.
 */
const InnerAlertProvider = ({ children }) => {
  //enqueueSnackbar y closeSnackbar son funciones de notistack para manejar las alertas.
  //enqueueSnackbar se usa para mostrar la alerta y closeSnackbar para cerrarla.
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  /**
   * Muestra una alerta en pantalla con las opciones dadas.
   *
   * @param {Object} options - Configuración de la alerta.
   * @param {string} options.message - Texto principal de la alerta.
   * @param {string} [options.title] - Título opcional que se muestra encima del mensaje.
   * @param {'success' | 'error' | 'warning' | 'info'} [options.severity='info'] - Tipo de alerta visual.
   * @param {'filled' | 'outlined' | 'standard'} [options.variant='outlined'] - Estilo de diseño del `MuiAlert`.
   * @param {number} [options.autoHideDuration=3000] - Tiempo en milisegundos antes de que se cierre automáticamente.
   * @param {Object} [options.anchorOrigin] - Posición en pantalla de la alerta.
   * @param {'top' | 'bottom'} options.anchorOrigin.vertical - Posición vertical.
   * @param {'left' | 'center' | 'right'} options.anchorOrigin.horizontal - Posición horizontal.
   *
   * @returns {void}
   */

  const showAlert = useCallback(
    ({
      message = '',
      title = '',
      severity = 'info',
      anchorOrigin = { vertical: 'top', horizontal: 'center' },
      variant = 'filled',
      autoHideDuration = 2000,
      action = null,
      icon = null,
    }) => {
      enqueueSnackbar(message, {
        variant: severity,
        persist: false,
        anchorOrigin,
        autoHideDuration,
        action: action ? (key) => action(key, closeSnackbar) : undefined,
        content: (key, msg) => (
          <MuiAlert
            key={key}
            onClose={() => closeSnackbar(key)}
            severity={severity}
            elevation={1}
            variant={variant}
            icon={icon ? icon : undefined}
            sx={{ width: '100%', borderRadius: '8px', whiteSpace: 'normal' }}
          >
            {title && <AlertTitle>{title}</AlertTitle>}
            {typeof msg === 'string'
              ? msg.split('\n').map((line, i) => <div key={i}>{line}</div>)
              : msg}
          </MuiAlert>
        ),
      });
    },
    [enqueueSnackbar, closeSnackbar]
  );

  //Valor del contexto memorizado para evitar re-renderizados innecesarios.
  const contextValue = useMemo(
    () => ({ showAlert, closeSnackbar }),
    [showAlert, closeSnackbar]
  );

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
    </AlertContext.Provider>
  );
};

/**
 * `AlertProvider`
 *
 * Proveedor principal de alertas para la aplicación.
 * Utiliza `SnackbarProvider` de notistack para manejar la cola de alertas, duración por defecto y posición.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al sistema de alertas.
 * @param {number} [props.maxSnack=3] - Máximo de alertas visibles al mismo tiempo.
 * @param {React.ElementType} [props.transition=Fade] - Componente de animación (ej: Slide, Fade, Grow).
 * @returns {JSX.Element} Proveedor completo del sistema de alertas.
 */
export const AlertProvider = ({
  children,
  transition = Fade,
  maxSnack,
  hiden = 100,
}) => {
  return (
    <SnackbarProvider
      maxSnack={maxSnack || 3}
      autoHideDuration={hiden}
      preventDuplicate={true}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={transition}
    >
      <InnerAlertProvider>{children}</InnerAlertProvider>
    </SnackbarProvider>
  );
};

/**
 * `useAlert`
 *
 * Hook para acceder al contexto de alertas.
 * Debe ser utilizado dentro de un componente envuelto por `AlertProvider`.
 *
 * @returns {Object} Funciones disponibles del contexto de alertas.
 * @property {Function} showAlert - Muestra una alerta.
 * @property {Function} closeSnackbar - Cierra la alerta.
 * @throws {Error} Lanza un error si se usa fuera del `AlertProvider`.
 */
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert debe ser usado dentro de AlertProvider');
  }
  return context;
};
