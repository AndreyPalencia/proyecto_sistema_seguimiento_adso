import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Login = lazy(() => import('../pages/auth/Login.jsx'));
const ResetearPassword = lazy(() =>
  import('../pages/auth/ResetearPassword.jsx')
);
const RecuperarPassword = lazy(() =>
  import('../pages/auth/RecuperarPassword.jsx')
);

const authRoutes = [
  { index: true, element: <Navigate to="login" replace /> },
  { path: 'login', element: <Login /> },
  { path: 'reset-password/request', element: <RecuperarPassword /> },
  { path: 'reset-password/confirm/:token', element: <ResetearPassword /> },
];

export default authRoutes;
