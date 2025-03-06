import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './style/Theme';
import CssBaseline from '@mui/material/CssBaseline';
import Router from './routes/Router';

/*
 * ThemeProvider: Proporciona el tema para los componentes de Material UI.
 * CssBaseline: Normaliza los estilos CSS para asegurar consistencia entre navegadores.
 * RouterProvider: Renderiza las rutas definidas en el objeto router.
 */

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={Router} />
    </ThemeProvider>
  );
}

export default App;
