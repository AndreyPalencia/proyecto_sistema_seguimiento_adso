import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './style/theme.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import Router from './routes/Router';
import { AuthProvider } from './context/AuthContext.jsx';
import { ActionsButtonsProvider } from './context/ActionsButtonsContext.jsx';
import { ConfirmDialogProvider } from './context/ConfirmDialogContext.jsx';
import { AprendicesProvider } from './context/AprendicesContext.jsx';
import { AprendizFichaProvider } from './context/AprendizFichaContext.jsx';
import { AprendizProvider } from './context/AprendizContext.jsx';
import { CheckboxProvider } from './context/CheckboxContext.jsx';
import { NumberNotificationsProvider } from './context/NumberNotifications';
import { LayoutProvider } from './context/LayoutContext.jsx';

//Importamos el contexto HeaderProvider para permitir a los componentes hijos acceder a la altura del header.
import { HeaderProvider } from '../src/context/HeaderContext';
import { AlertProvider } from './context/AlertContext.jsx';
import { Suspense } from 'react';
import LazyLoader from './components/Feedback/LazyLoader.jsx';

import './style/styles.css';
/*
 * ThemeProvider: Proporciona el tema para los componentes de Material UI.
 * CssBaseline: Normaliza los estilos CSS para asegurar consistencia entre navegadores.
 * RouterProvider: Renderiza las rutas definidas en el objeto router.
 */

function App() {
  return (
    <Suspense fallback={<LazyLoader />}>
      <NumberNotificationsProvider>
        <HeaderProvider>
          <LayoutProvider>
            <AlertProvider>
              <AprendicesProvider>
                <AprendizFichaProvider>
                  <AprendizProvider>
                    <ActionsButtonsProvider>
                      <CheckboxProvider>
                        <HeaderProvider>
                          <AuthProvider>
                            <ConfirmDialogProvider>
                              <ThemeProvider theme={theme}>
                                <CssBaseline />
                                <RouterProvider router={Router} />
                              </ThemeProvider>
                            </ConfirmDialogProvider>
                          </AuthProvider>
                        </HeaderProvider>
                      </CheckboxProvider>
                    </ActionsButtonsProvider>
                  </AprendizProvider>
                </AprendizFichaProvider>
              </AprendicesProvider>
            </AlertProvider>
          </LayoutProvider>
        </HeaderProvider>
      </NumberNotificationsProvider>
    </Suspense>
  );
}

export default App;
