import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { lazy } from 'react';

//Importacion de rutas de los diferentes roles de usuario
import authRoutes from './authRoutes';
import instructorRoutes from './instructorRoutes';
import aprendizRoutes from './aprendizRoutes';
import adminRoutes from './adminRoutes.jsx';

const AuthLayout = lazy(() => import('../layout/AuthLayout.jsx'));
const DashboardLayout = lazy(() => import('../layout/DashboardLayout.jsx'));
const PrivateRouteLayout = lazy(() =>
  import('../components/ProtectedRoute/PrivateRouteLayout.jsx')
);
const NotFound = lazy(() => import('../pages/NotFound.jsx'));

const Router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: authRoutes,
  },
  {
    path: '/instructor/:idInstructor',
    element: (
      <PrivateRouteLayout allowedRoles={['admin', 'instructor']}>
        <DashboardLayout />
      </PrivateRouteLayout>
    ),
    children: instructorRoutes,
  },
  {
    path: '/aprendiz/:idAprendiz',
    element: (
      <PrivateRouteLayout allowedRoles={['admin', 'aprendiz']}>
        <DashboardLayout />
      </PrivateRouteLayout>
    ),
    children: aprendizRoutes,
  },
  {
    path: 'admin',
    element: (
      <PrivateRouteLayout allowedRoles={['admin']}>
        <DashboardLayout />
      </PrivateRouteLayout>
    ),
    children: adminRoutes,
  },
  { path: '*', element: <NotFound /> },
  { index: true, element: <Navigate to="/auth" replace /> },
]);

export default Router;
