import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

/** Páginas generales del usuario */
const UsuarioDetalles = lazy(() => import('../pages/UsuarioDetalles.jsx'));
const NotAuth = lazy(() => import('../pages/NotAuth.jsx'));

/** Páginas relacionadas con fichas */
const FichasInstructor = lazy(() =>
  import('../pages/instructor/FichasInstructor.jsx')
);
const FichaDetalles = lazy(() => import('../pages/FichaDetalles.jsx'));
const CalendarioFichas = lazy(() =>
  import('../pages/instructor/CalendarioFichas.jsx')
);
const CalendarioByFicha = lazy(() =>
  import('../pages/instructor/CalendarioByFicha.jsx')
);
const ReporteGeneralFichas = lazy(() =>
  import('../pages/ReporteGeneralFichas.jsx')
);

/** Páginas relacionadas con aprendices */
const AprendicesFicha = lazy(() =>
  import('../pages/instructor/AprendicesFicha.jsx')
);
const AprendizDetalles = lazy(() =>
  import('../pages/instructor/AprendizDetalles.jsx')
);
const EmpresaAprendiz = lazy(() =>
  import('../pages/instructor/EmpresaAprendiz.jsx')
);
const ObservacionesInstructor = lazy(() =>
  import('../pages/instructor/ObservacionesInstructor.jsx')
);
const SegumientoAprendiz = lazy(() =>
  import('../pages/instructor/SegumientoAprendiz.jsx')
);

const ReportesInstructorGFPIF = lazy(() =>
  import('../pages/instructor/SegumientoAprendiz/ReportesInstructorGFPIF.jsx')
);
/**
 * Rutas del módulo de instructor.
 * Se agrupan por funcionalidad: fichas, aprendices, reportes, etc.
 */
const instructorRoutes = [
  // Redirección por defecto a la ruta de fichas
  {
    index: true, // <-- Esta es la clave
    element: <Navigate to="fichas" replace />,
  },
  /** Rutas generales de usuario */
  { path: 'info-usuario', element: <UsuarioDetalles /> },
  { path: 'no-autorizado', element: <NotAuth /> },

  /** Gestión de fichas */
  { path: 'fichas', element: <FichasInstructor /> },
  { path: 'calendario-fichas', element: <CalendarioFichas /> },
  { path: 'ficha/:idFicha/info', element: <FichaDetalles /> },
  {
    path: 'ficha/:idFicha/calendario-ficha',
    element: <CalendarioByFicha />,
  },

  /** Gestión de aprendices de una ficha */
  { path: 'ficha/:idFicha/aprendices', element: <AprendicesFicha /> },
  {
    path: 'ficha/:idFicha/aprendiz/:idAprendiz/info',
    element: <AprendizDetalles />,
  },
  {
    path: 'ficha/:idFicha/aprendiz/:idAprendiz/empresa',
    element: <EmpresaAprendiz />,
  },
  {
    path: 'ficha/:idFicha/aprendiz/:idAprendiz/observaciones',
    element: <ObservacionesInstructor />,
  },
  {
    path: 'ficha/:idFicha/aprendiz/:idAprendiz/seguimiento',
    element: <SegumientoAprendiz />,
  },
  {
    path: 'ficha/:idFicha/aprendiz/:idAprendiz/reportes-gfpi-f',
    element: <ReportesInstructorGFPIF />,
  },

  /** Reportes */
  {
    path: 'reporte-general-ficha',
    element: <ReporteGeneralFichas />,
  },
];

export default instructorRoutes;
