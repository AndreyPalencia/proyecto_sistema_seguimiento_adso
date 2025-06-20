import { BaseIcons } from './BaseIcons';

import { useSidebar } from '../../../context/SidebarContext';

//Mapeo de navegación con sus respectivos iconos, labels y paths
export const navigationConfig = (userId, role, selectedIds = {}, clearId) => {
  const idFicha = selectedIds.idFicha;
  const idAprendiz = selectedIds.idAprendiz;
  const idInstructorAdmin = selectedIds.idInstructorAdmin;

  const { sidebarStack } = useSidebar();

  // console.log('navigationConfig:', {
  //   userId,
  //   role,
  //   selectedIds,
  //   clearId,
  //   sidebarStack,
  // });

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
    fichas: {
      icon: BaseIcons.dashboard,
      label: 'Fichas',
      path: `/${role}/${userId}/fichas`,
    },
    fichasAprendiz: {
      icon: BaseIcons.dashboard,
      label: 'Fichas',
      path: `/${role}/${userId}/fichas`,
    },
    fichasAdmin: {
      icon: BaseIcons.dashboard,
      label: 'Fichas',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/fichas`,
    },
    aprendices: {
      icon: BaseIcons.groupsIcon,
      label: 'Aprendices',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendices`,
      onClick: () => clearId?.('idAprendiz'),
    },
    aprendicesAdmin: {
      icon: BaseIcons.groupsIcon,
      label: 'Aprendices',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/aprendices`,
      onClick: () => clearId?.('idAprendiz'),
    },
    infoFicha: {
      icon: BaseIcons.info,
      label: 'Información Ficha',
      path: `/${role}/${userId}/ficha/${idFicha}/info`,
      onClick: () => clearId?.('idAprendiz'),
    },
    infoFichaAdmin: {
      icon: BaseIcons.info,
      label: 'Información Ficha',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/info`,
      onClick: () => clearId?.('idAprendiz'),
    },
    calendarioFicha: {
      icon: BaseIcons.event,
      label: 'Calendario Ficha',
      path: `/${role}/${userId}/ficha/${idFicha}/calendario-ficha`,
      onClick: () => clearId?.('idAprendiz'),
    },
    calendarioFichaAdmin: {
      icon: BaseIcons.event,
      label: 'Calendario Ficha',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/calendario-ficha`,
      onClick: () => clearId?.('idAprendiz'),
    },
    calendarioGeneral: {
      icon: BaseIcons.calendar,
      label: 'Calendario',
      path: `/${role}/${userId}/calendario-fichas`,
    },
    calendarioGeneralAdmin: {
      icon: BaseIcons.calendar,
      label: 'Calendario',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/calendario-fichas`,
    },
    infoAprendiz: {
      icon: BaseIcons.manage,
      label: 'Aprendiz',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendiz/${idAprendiz}/info`,
    },
    infoAprendizAdmin: {
      icon: BaseIcons.manage,
      label: 'Aprendiz',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/aprendiz/${idAprendiz}/info`,
    },
    visitas: {
      icon: BaseIcons.today,
      label: 'Visitas',
      path: `/${role}/${userId}/visitas`,
    },
    seguimiento: {
      icon: BaseIcons.analytics,
      label: 'Seguimiento',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendiz/${idAprendiz}/seguimiento`,
    },
    seguimientoAdmin: {
      icon: BaseIcons.analytics,
      label: 'Seguimiento',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/aprendiz/${idAprendiz}/seguimiento`,
    },
    seguimientoAprendiz: {
      icon: BaseIcons.analytics,
      label: 'Seguimiento',
      path: `/${role}/${userId}/ficha/${idFicha}/seguimiento`,
    },
    observaciones: {
      icon: BaseIcons.search,
      label: 'Observaciones',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendiz/${idAprendiz}/observaciones`,
    },
    observacionesAdmin: {
      icon: BaseIcons.search,
      label: 'Observaciones',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/aprendiz/${idAprendiz}/observaciones`,
    },
    observacionesAprendiz: {
      icon: BaseIcons.search,
      label: 'Observaciones',
      path: `/${role}/${userId}/ficha/${idFicha}/observaciones`,
    },
    reportes: {
      icon: BaseIcons.doc,
      label: 'Reportes',
      path: `/${role}/${userId}/reporte-general-ficha`,
    },
    reportesAdmin: {
      icon: BaseIcons.doc,
      label: 'Reportes',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/reporte-general-ficha`,
    },
    reportesGFPI_F: {
      icon: BaseIcons.doc,
      label: 'Reportes GFPI F',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendiz/${idAprendiz}/reportes-gfpi-f`,
    },
    reportesGFPI_FAdmin: {
      icon: BaseIcons.doc,
      label: 'Reportes GFPI F',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/aprendiz/${idAprendiz}/reportes-gfpi-f`,
    },
    configuracion: {
      icon: BaseIcons.settings,
      label: 'Configuración',
      path: `/${role}/${userId}/`,
    },
    empresa: {
      icon: BaseIcons.company,
      label: 'Empresa',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendiz/${idAprendiz}/empresa`,
    },
    empresaAdmin: {
      icon: BaseIcons.company,
      label: 'Empresa',
      path: `/${role}/rol/instructor/${idInstructorAdmin}/ficha/${idFicha}/aprendiz/${idAprendiz}/empresa`,
    },
    empresaAprendiz: {
      icon: BaseIcons.company,
      label: 'Empresa',
      path: `/${role}/${userId}/ficha/${idFicha}/empresa`,
    },
    aprendiz: {
      icon: BaseIcons.person,
      label: 'Aprendiz ',
    },
    aprendizAdmin: {
      icon: BaseIcons.person,
      label: 'Aprendiz ',
    },
    instructor: {
      icon: BaseIcons.school,
      label: 'Instructor',
    },
    mainInstructor: {
      icon: BaseIcons.school,
      label: 'Instructor',
      path: `/admin/rol/instructor/${idInstructorAdmin}/fichas`,
    },
  };
};

//Mapeo del selecion por rol
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

//Configuración de permisos por rol y submenus
export const sidebarMenus = {
  admin: {
    main: ['usuarios'],
    mainInstructor: ['fichasAdmin', 'calendarioGeneralAdmin', 'reportesAdmin'],
    fichaInstructor: [
      'aprendicesAdmin',
      'infoFichaAdmin',
      'calendarioFichaAdmin',
      'aprendizAdmin',
    ],
    aprendizAdmin: [
      'infoAprendizAdmin',
      'empresaAdmin',
      'observacionesAdmin',
      'seguimientoAdmin',
      'reportesGFPI_FAdmin',
    ],
  },
  instructor: {
    main: ['fichas', 'calendarioGeneral', 'reportes'],
    ficha: ['aprendices', 'infoFicha', 'calendarioFicha', 'aprendiz'],
    aprendiz: [
      'infoAprendiz',
      'empresa',
      'observaciones',
      'seguimiento',
      'reportesGFPI_F',
    ],
  },

  aprendiz: {
    main: [],
    fichasAprendiz: [
      'calendarioFicha',
      'infoFicha',
      'empresaAprendiz',
      'observacionesAprendiz',
      'seguimientoAprendiz',
    ],
  },
};
