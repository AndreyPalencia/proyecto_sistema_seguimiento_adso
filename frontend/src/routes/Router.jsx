import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout.jsx';
import TestColors from '../style/TestColors.jsx';


/**
 * Configuración de rutas utilizando React Router v7.
 *
 * - `createBrowserRouter`: Crea un objeto de rutas para
 * gestionar la navegación de la aplicación.
 * - `path`: Define las rutas de la aplicación.
 * - `element`: Especifica el componente que se renderiza para cada ruta.
 *
 */

const Router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        path: 'TestColor',
        element: <TestColors />,
      }
    ],
  },
]);

export default Router;
