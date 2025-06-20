import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const UsuarioDetalles = lazy(() => import('../pages/UsuarioDetalles.jsx'));
const NotAuth = lazy(() => import('../pages/NotAuth.jsx'));

const Usuarios = lazy(() => import('../pages/admin/Usuarios.jsx'));

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

const adminRoutes = [
  {
    index: true, // <-- Esta es la clave
    element: <Navigate to="usuarios" replace />,
  },
  /** Rutas generales de usuario */
  { path: 'info-usuario', element: <UsuarioDetalles /> },
  { path: 'no-autorizado', element: <NotAuth /> },

  /** Rutas de modulo de usuarios*/
  { path: 'usuarios', element: <Usuarios /> },

  /** Gestión de fichas */
  {
    path: 'rol/instructor/:idInstructorAdmin/fichas',
    element: <FichasInstructor />,
  },
  {
    path: 'rol/instructor/:idInstructorAdmin/calendario-fichas',
    element: <CalendarioFichas />,
  },
  {
    path: 'rol/instructor/:idInstructorAdmin/ficha/:idFicha/info',
    element: <FichaDetalles />,
  },
  {
    path: 'rol/instructor/:idInstructorAdmin/ficha/:idFicha/calendario-ficha',
    element: <CalendarioByFicha />,
  },

  /** Gestión de aprendices de una ficha */
  {
    path: 'rol/instructor/:idInstructorAdmin/ficha/:idFicha/aprendices',
    element: <AprendicesFicha />,
  },
  {
    path: 'rol/instructor/:idInstructorAdmin/ficha/:idFicha/aprendiz/:idAprendiz/info',
    element: <AprendizDetalles />,
  },
  {
    path: 'rol/instructor/:idInstructorAdmin/ficha/:idFicha/aprendiz/:idAprendiz/empresa',
    element: <EmpresaAprendiz />,
  },
  {
    path: 'rol/instructor/:idInstructorAdmin/ficha/:idFicha/aprendiz/:idAprendiz/observaciones',
    element: <ObservacionesInstructor />,
  },
  {
    path: 'rol/instructor/:idInstructorAdmin/ficha/:idFicha/aprendiz/:idAprendiz/seguimiento',
    element: <SegumientoAprendiz />,
  },
  {
    path: 'rol/instructor/:idInstructorAdmin/ficha/:idFicha/aprendiz/:idAprendiz/reportes-gfpi-f',
    element: <ReportesInstructorGFPIF />,
  },

  /** Reportes */
  {
    path: 'rol/instructor/:idInstructorAdmin/reporte-general-ficha',
    element: <ReporteGeneralFichas />,
  },
];

export default adminRoutes;
