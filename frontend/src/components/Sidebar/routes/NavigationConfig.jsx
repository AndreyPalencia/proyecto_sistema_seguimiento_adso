import { BaseIcons } from './BaseIcons';
import { useSidebar } from '../../../context/SidebarContext';

export const navigationConfig = (userId, role, selectedIds = {}, clearId) => {
  const { idFicha, idAprendiz, idInstructorAdmin, idAprendizAdmin } =
    selectedIds;
  const { sidebarStack } = useSidebar();

  return {
    home: {
      icon: BaseIcons.home,
      label: 'Inicio',
      path: `/${role}/${userId}/fichas`,
    },
    usuarios: {
      icon: BaseIcons.groups,
      label: 'Usuarios',
      path: `/${role}/usuarios`,
      onClick: () => clearId?.('idInstructorAdmin'),
    },
    perfil: {
      icon: BaseIcons.person,
      label: 'Perfil',
      path: `/${role}/${userId}/perfil`,
    },
    mainFichasInstructor: {
      icon: BaseIcons.dashboard,
      label: 'Fichas',
      path: `/${role}/${userId}/fichas`,
    },
    mainFichasInstructorAdmin: {
      icon: BaseIcons.dashboard,
      label: 'Fichas',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/fichas`,
    },
    fichaAprendicesInstructor: {
      icon: BaseIcons.groupsIcon,
      label: 'Aprendices',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendices`,
      onClick: () => clearId?.('idAprendiz'),
    },
    fichaAprendicesInstructorAdmin: {
      icon: BaseIcons.groupsIcon,
      label: 'Aprendices',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/aprendices`,
      onClick: () => clearId?.('idAprendiz'),
    },
    fichaInfoInstructor: {
      icon: BaseIcons.info,
      label: 'Información Ficha',
      path: `/${role}/${userId}/ficha/${idFicha}/info`,
    },
    fichaInfoInstructorAdmin: {
      icon: BaseIcons.info,
      label: 'Información Ficha',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/info`,
    },
    fichaInfoAprendizAdmin: {
      icon: BaseIcons.info,
      label: 'Información Ficha',
      path: `/${role}/rol/aprendiz/${idAprendizAdmin}/ficha/${idFicha}/info`,
    },
    fichaCalendarioAprendiz: {
      icon: BaseIcons.event,
      label: 'Calendario Ficha',
      path: `/${role}/${userId}/ficha/${idFicha}/calendario-ficha`,
    },
    fichaCalendarioInstructor: {
      icon: BaseIcons.event,
      label: 'Calendario Ficha',
      path: `/${role}/${userId}/ficha/${idFicha}/calendario-ficha`,
    },
    fichaCalendarioInstructorAdmin: {
      icon: BaseIcons.event,
      label: 'Calendario Ficha',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/calendario-ficha`,
    },
    fichaCalendarioAprendizAdmin: {
      icon: BaseIcons.event,
      label: 'Calendario Ficha',
      path: `/${role}/rol/aprendiz/${idAprendizAdmin}/ficha/${idFicha}/calendario-ficha`,
    },
    // Agregando versión específica para aprendiz - información de ficha
    fichaInfoAprendiz: {
      icon: BaseIcons.info,
      label: 'Información Ficha',
      path: `/${role}/${userId}/ficha/${idFicha}/info`,
    },
    calendarioGeneralInstructor: {
      icon: BaseIcons.calendar,
      label: 'Calendario General',
      path: `/${role}/${userId}/calendario-fichas`,
    },
    calendarioGeneralInstructorAdmin: {
      icon: BaseIcons.calendar,
      label: 'Calendario General',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/calendario-fichas`,
    },
    aprendizInfoInstructor: {
      icon: BaseIcons.manage,
      label: 'Información Aprendiz',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendiz/${idAprendiz}/info`,
    },
    aprendizInfoInstructorAdmin: {
      icon: BaseIcons.manage,
      label: 'Información Aprendiz',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/aprendiz/${idAprendiz}/info`,
    },
    // Agregando versión específica para aprendiz
    aprendizInfoAprendiz: {
      icon: BaseIcons.manage,
      label: 'Mi Información',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendiz/${idAprendiz}/info`,
    },
    aprendizSeguimientoInstructor: {
      icon: BaseIcons.analytics,
      label: 'Seguimiento',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendiz/${idAprendiz}/seguimiento`,
    },
    aprendizSeguimientoInstructorAdmin: {
      icon: BaseIcons.analytics,
      label: 'Seguimiento',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/aprendiz/${idAprendiz}/seguimiento`,
    },
    // Agregando versión específica para aprendiz
    aprendizSeguimientoAprendiz: {
      icon: BaseIcons.analytics,
      label: 'Seguimiento',
      path: `/${role}/${userId}/ficha/${idFicha}/seguimiento`,
    },
    fichaSeguimientoAprendizAdmin: {
      icon: BaseIcons.analytics,
      label: 'Seguimiento',
      path: `/${role}/rol/aprendiz/${idAprendizAdmin}/ficha/${idFicha}/seguimiento`,
    },
    aprendizObservacionesInstructor: {
      icon: BaseIcons.search,
      label: 'Observaciones',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendiz/${idAprendiz}/observaciones`,
    },
    aprendizObservacionesInstructorAdmin: {
      icon: BaseIcons.search,
      label: 'Observaciones',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/aprendiz/${idAprendiz}/observaciones`,
    },
    // Agregando versión específica para aprendiz
    aprendizObservacionesAprendiz: {
      icon: BaseIcons.search,
      label: 'Observaciones',
      path: `/${role}/${userId}/ficha/${idFicha}/observaciones`,
    },
    fichaObservacionesAprendizAdmin: {
      icon: BaseIcons.search,
      label: 'Observaciones',
      path: `/${role}/rol/aprendiz/${idAprendizAdmin}/ficha/${idFicha}/observaciones`,
    },
    fichaReportesInstructor: {
      icon: BaseIcons.doc,
      label: 'Reportes Generales',
      path: `/${role}/${userId}/reporte-general-ficha`,
    },
    fichaReportesInstructorAdmin: {
      icon: BaseIcons.doc,
      label: 'Reportes Generales',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/reporte-general-ficha`,
    },
    aprendizReportesGFPIInstructor: {
      icon: BaseIcons.doc,
      label: 'Reportes GFPI ',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendiz/${idAprendiz}/reportes-gfpi-f`,
    },
    aprendizReportesGFPIInstructorAdmin: {
      icon: BaseIcons.doc,
      label: 'Reportes GFPI ',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/aprendiz/${idAprendiz}/reportes-gfpi-f`,
    },
    fichaReportesGFPIAprendizAdmin: {
      icon: BaseIcons.doc,
      label: 'Reportes GFPI ',
      path: `/${role}/rol/aprendiz/${idAprendizAdmin}/ficha/${idFicha}/reportes-gfpi-f`,
    },
    aprendizEmpresaInstructor: {
      icon: BaseIcons.company,
      label: 'Empresa',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendiz/${idAprendiz}/empresa`,
    },
    aprendizEmpresaInstructorAdmin: {
      icon: BaseIcons.company,
      label: 'Empresa',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/aprendiz/${idAprendiz}/empresa`,
    },
    // Agregando versión específica para aprendiz
    aprendizEmpresaAprendiz: {
      icon: BaseIcons.company,
      label: 'Empresa',
      path: `/${role}/${userId}/ficha/${idFicha}/empresa`,
    },
    fichaEmpresaAprendizAdmin: {
      icon: BaseIcons.company,
      label: 'Información Empresa',
      path: `/${role}/rol/aprendiz/${idAprendizAdmin}/ficha/${idFicha}/empresa`,
    },
    aprendiz: {
      icon: BaseIcons.person,
      label: 'Aprendiz',
    },
    aprendizAdminInstructor: {
      icon: BaseIcons.person,
      label: 'Aprendiz',
    },

    infoPerfilInstructorAdmin: {
      icon: BaseIcons.school,
      label: 'Perfil del Instructor',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/info-perfil`,
    },

    fichaPerfilAprendizAdmin: {
      icon: BaseIcons.person,
      label: 'Perfil del Aprendiz',
      path: `/${role}/rol/aprendiz/${idAprendizAdmin}/info-perfil`,
    },
    fichasPerfilAprendizAdmin: {
      icon: BaseIcons.analytics,
      label: 'Fichas Aprendiz',
      path: `/${role}/rol/aprendiz/${idAprendizAdmin}/fichas`,
    },
  };
};

export const roleDisplayConfig = (userId) => ({
  admin: {
    icon: BaseIcons.supervisor,
    label: 'Administrador',
    path: `/admin`,
  },
  instructor: {
    icon: BaseIcons.school,
    label: 'Instructor',
    path: `/instructor/${userId}/fichas`,
  },
  aprendiz: {
    icon: BaseIcons.account,
    label: 'Aprendiz',
    path: `/aprendiz/${userId}`,
  },
});

export const sidebarMenus = {
  admin: {
    main: ['usuarios'],
    mainInstructor: [
      'infoPerfilInstructorAdmin',
      'mainFichasInstructorAdmin',
      'calendarioGeneralInstructorAdmin',
      'fichaReportesInstructorAdmin',
    ],
    fichaInstructor: [
      'fichaAprendicesInstructorAdmin',
      'fichaInfoInstructorAdmin',
      'fichaCalendarioInstructorAdmin',
      'aprendizAdminInstructor',
    ],
    aprendizAdminInstructor: [
      'aprendizInfoInstructorAdmin',
      'aprendizEmpresaInstructorAdmin',
      'aprendizObservacionesInstructorAdmin',
      'aprendizSeguimientoInstructorAdmin',
      'aprendizReportesGFPIInstructorAdmin',
    ],
    fichasAprendizAdminPerfil: [
      'fichaPerfilAprendizAdmin',
      'fichasPerfilAprendizAdmin',
      'fichasAprendizAdmin',
    ],
    fichasAprendizAdmin: [
      'fichaCalendarioAprendizAdmin',
      'fichaInfoAprendizAdmin',
      'fichaEmpresaAprendizAdmin',
      'fichaObservacionesAprendizAdmin',
      'fichaSeguimientoAprendizAdmin',
      'fichaReportesGFPIAprendizAdmin',
    ],
  },
  instructor: {
    main: [
      'mainFichasInstructor',
      'calendarioGeneralInstructor',
      'fichaReportesInstructor',
    ],
    ficha: [
      'fichaAprendicesInstructor',
      'fichaInfoInstructor',
      'fichaCalendarioInstructor',
      'aprendiz',
    ],
    aprendiz: [
      'aprendizInfoInstructor',
      'aprendizEmpresaInstructor',
      'aprendizObservacionesInstructor',
      'aprendizSeguimientoInstructor',
      'aprendizReportesGFPIInstructor',
    ],
  },
  aprendiz: {
    main: [],
    fichasAprendiz: [
      'fichaCalendarioAprendiz',
      'fichaInfoAprendiz',
      'aprendizEmpresaAprendiz',
      'aprendizObservacionesAprendiz',
      'aprendizSeguimientoAprendiz',
    ],
  },
};
