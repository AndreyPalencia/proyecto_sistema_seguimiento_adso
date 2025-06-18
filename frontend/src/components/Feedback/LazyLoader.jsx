import CircularProgress from '@mui/material/CircularProgress';
import { Box, Typography } from '@mui/material';

/**
 * Componente de indicador de carga para suspensiones de React (Lazy Loading).
 * Se muestra mientras un componente hijo se está cargando de forma diferida con `React.lazy()`.
 *
 * @example
 * import { Suspense, lazy } from 'react';
 * import LazyLoader from './LazyLoader';
 *
 * const DashboardLayout = lazy(() => import('../layout/DashboardLayout.jsx'));
 *
 * const App = () => (
 *   <Suspense fallback={<LazyLoader />}>
 *     <DashboardLayout />
 *   </Suspense>
 * );
 */
const LazyLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <img
          src="/logoSena.png"
          alt="Cargando..."
          style={{
            width: 150,
          }}
        />
        <CircularProgress sx={{ color: '#4CAF50' }} />
      </Box>
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Cargando, por favor espera...
      </Typography>
    </Box>
  );
};

export default LazyLoader;
