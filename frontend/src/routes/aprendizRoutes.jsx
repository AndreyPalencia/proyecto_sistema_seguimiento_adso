import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const UsuarioDetalles = lazy(() => import('../pages/UsuarioDetalles.jsx'));
const NotAuth = lazy(() => import('../pages/NotAuth.jsx'));

/** Páginas relacionadas con aprendices */

const AprendizFichas = lazy(() =>
  import('../pages/aprendiz/AprendizFichas.jsx')
);

const FichaDetalles = lazy(() => import('../pages/FichaDetalles.jsx'));

const EmpresaAprendiz = lazy(() =>
  import('../pages/aprendiz/EmpresaAprendiz.jsx')
);

const ObservacionesAprendiz = lazy(() =>
  import('../pages/aprendiz/ObservacionesAprendiz.jsx')
);

const SegumientoEtapaPracticaAprendiz = lazy(() =>
  import('../pages/aprendiz/SegumientoEtapaPracticaAprendiz.jsx')
);

const CalendarioAprendiz = lazy(() =>
  import('../pages/aprendiz/CalendarioAprendiz.jsx')
);

const aprendizRoutes = [
  // Redirección por defecto a la ruta de fichas
  {
    index: true, // <-- Esta es la clave
    element: <Navigate to="fichas" replace />,
  },
  /** Rutas generales de usuario */
  { path: 'info-usuario', element: <UsuarioDetalles /> },
  { path: 'no-autorizado', element: <NotAuth /> },

  /** Gestión de aprendices de una ficha */
  { path: 'fichas', element: <AprendizFichas /> },
  {
    path: 'ficha/:idFicha/calendario-ficha',
    element: <CalendarioAprendiz />,
  },
  { path: 'ficha/:idFicha/info', element: <FichaDetalles /> },

  {
    path: 'ficha/:idFicha/empresa',
    element: <EmpresaAprendiz />,
  },
  {
    path: 'ficha/:idFicha/observaciones',
    element: <ObservacionesAprendiz />,
  },
  {
    path: 'ficha/:idFicha/seguimiento',
    element: <SegumientoEtapaPracticaAprendiz />,
  },
];

export default aprendizRoutes;
