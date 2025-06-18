import { Box, Typography, Button } from '@mui/material';

/**
 * Componente de manejo de errores para `React Router` o `Error Boundaries`.
 * Se utiliza para mostrar un mensaje de error cuando algo falla en la aplicación.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.mensaje="Ocurrió un error, revise su conexión."] - Mensaje de error a mostrar.
 * @param {Function} [props.onRetry] - Función opcional que se ejecuta al presionar el botón "Reintentar".
 * @returns {JSX.Element} Un cuadro de error con mensaje y botón de reintento (opcional).
 *
 * @example
 * import ErrorFallback from './ErrorFallback';
 *
 * const SomeComponent = () => {
 *   return (
 *     <ErrorFallback
 *       mensaje="No se pudo cargar la página."
 *       onRetry={() => window.location.reload()}
 *     />
 *   );
 * };
 */
const ErrorFallback = ({
  mensaje = 'Ocurrió un error, revise su conexión.',
  onRetry,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" color="error" gutterBottom>
        ERROR
      </Typography>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        {mensaje}
      </Typography>
      {onRetry && (
        <Button variant="contained" color="primary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </Box>
  );
};

export default ErrorFallback;
