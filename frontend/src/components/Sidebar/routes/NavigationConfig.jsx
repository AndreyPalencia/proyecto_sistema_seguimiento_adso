import { BaseIcons } from './BaseIcons';

//Mapeo de navegación con sus respectivos iconos, labels y paths
export const navigationConfig = (userId, role, selectedIds = {}, clearId) => {
  const idFicha = selectedIds.idFicha;
  const idAprendiz = selectedIds.idAprendiz;

  //console.log('navigationConfig:', { userId, role, selectedIds, clearId });

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
    fichasAdmin: {
      icon: BaseIcons.dashboard,
      label: 'Fichas',
      path: `/${role}/fichas`,
    },
    aprendices: {
      icon: BaseIcons.groupsIcon,
      label: 'Aprendices',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendices`,
      onClick: () => clearId?.('idAprendiz'),
    },
    infoFicha: {
      icon: BaseIcons.info,
      label: 'Información Ficha',
      path: `/${role}/${userId}/ficha/${idFicha}/info`,
    },
    calendarioFicha: {
      icon: BaseIcons.event,
      label: 'Calendario Ficha',
      path: `/${role}/${userId}/ficha/${idFicha}/calendario-ficha`,
    },
    calendarioGeneral: {
      icon: BaseIcons.calendar,
      label: 'Calendario',
      path: `/${role}/${userId}/calendario-fichas`,
    },
    infoAprendiz: {
      icon: BaseIcons.manage,
      label: 'Aprendiz',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendiz/${idAprendiz}/info`,
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
    reportesGFPI_F: {
      icon: BaseIcons.doc,
      label: 'Reportes GFPI F',
      path: `/${role}/${userId}/ficha/${idFicha}/aprendiz/${idAprendiz}/reportes-gfpi-f`,
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
    empresaAprendiz: {
      icon: BaseIcons.company,
      label: 'Empresa',
      path: `/${role}/${userId}/ficha/${idFicha}/empresa`,
    },
    aprendiz: {
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
    main: ['usuarios', 'mainInstructor'],
    mainInstructor: ['fichas', 'calendarioGeneral', 'reportes'],
    ficha: ['aprendices', 'infoFicha', 'calendarioFicha'],
    aprendiz: [
      'infoAprendiz',
      'empresa',
      'observaciones',
      'seguimiento',
      'reportesGFPI_F',
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
    ficha: [
      'calendarioFicha',
      'infoFicha',
      'empresaAprendiz',
      'observacionesAprendiz',
      'seguimientoAprendiz',
    ],
  },
};
