const formatoSegumientoActitudinales = [
  {
    variable: 'RELACIONES INTERPERSONALES',
    descripcion:
      'Desarrolla relaciones interpersonales con las personas de los diferentes niveles del ente Conformador en forma armoniosa, respetuosa y enmarcada dentro de los principios de convivencia social.',
    referencia: { relacionesInterpersonales: true, relacionesObservacion: '' },
  },
  {
    variable: 'TRABAJO EN EQUIPO',
    descripcion:
      'Participa en forma activa y propositiva en equipos de trabajo asumiendo los roles, de acuerdo con sus fortalezas.',
    referencia: { trabajoEnEquipo: true, trabajoObservacion: '' },
  },
  {
    variable: 'SOLUCIÓN DE PROBLEMAS',
    descripcion:
      'Propone alternativas de solución a situaciones problemáticas, en el contexto del desarrollo de su etapa productiva. ',
    referencia: { solucionProblemas: true, solucionProblemasObservacion: '' },
  },
  {
    variable: 'CUMPLIMIENTO',
    descripcion:
      'Asume compromiso de las funciones y responsabilidades asignadas en el desarrollo de su trabajo.',
    referencia: { cumplimiento: true, cumplimientoObservacion: '' },
  },
  {
    variable: 'ORGANIZACIÓN',
    descripcion:
      'Demuestra capacidad para ordenar y disponer los elementos necesarios e información para facilitar la ejecución de un trabajo y el logro de los objetivos.',
    referencia: { organizacion: true, organizacionObservacion: '' },
  },
];

const formatoSegumientoTecnico = [
  {
    variable: 'TRANSFERENCIA DE CONOCIMIENTO',
    descripcion:
      'Demuestra las competencias específicas del programa de formación en situaciones reales de trabajo. ',
    referencia: {
      transferenciaConocimiento: true,
      transferenciaObservacion: '',
    },
  },
  {
    variable: 'MEJORA CONTINUA',
    descripcion:
      'Aporta al mejoramiento de los procesos propios de su desempeño.',
    referencia: { mejoraContinua: true, mejoraContinuaObservacion: '' },
  },
  {
    variable: 'FORTALECIMIENTO OCUPACIONAL',
    descripcion:
      'Autogestiona acciones que fortalezca su perfil ocupacional en el marco de su proyecto de vida',
    referencia: {
      fortalecimientOcupacional: true,
      fortalecimientoObservacion: '',
    },
  },
  {
    variable: 'OPORTUNIDAD Y CALIDAD',
    descripcion:
      'Presenta con oportunidad y calidad los productos generados en el desarrollo de sus funciones y actividades.',
    referencia: { calidad: true, calidadObservacion: '' },
  },
  {
    variable: 'RESPONSABILIDAD AMBIENTAL',
    descripcion:
      'Administra los recursos para el desarrollo de sus actividades con criterios de responsabilidad ambiental.',
    referencia: { ambiental: true, ambientalObservacion: '' },
  },
  {
    variable: 'ADMINISTRACIÓN DE RECURSOS',
    descripcion:
      'Utiliza de manera racional los materiales, equipos y herramientas suministrados para el desempeño de sus actividades o funciones.',
    referencia: { administracion: true, administracionObservacion: '' },
  },
  {
    variable: 'SEGURIDAD OCUPACIONAL E INDUSTRIAL',
    descripcion:
      'Utiliza   los elementos de seguridad y salud ocupacional de acuerdo con la normatividad vigente establecida para sus actividades o funciones.',
    referencia: { seguridad: true, seguridadObservacion: '' },
  },
  {
    variable: 'DOCUMENTACIÓN ETAPA PRODUCTIVA',
    descripcion: 'Actualiza permanentemente el portafolio de evidencias.',
    referencia: { documentacion: true, documentacionObservacion: '' },
  },
];

const formatoSegumientoActitudinalesSimplificado =
  formatoSegumientoActitudinales
    .map((item) => {
      const { variable, descripcion, referencia, ...resto } = item;
      const nuevoObjeto = { ...referencia };
      return nuevoObjeto;
    })
    .reduce((acc, item) => {
      return { ...acc, ...item.referencia };
    }, {});

const formatoSegumientoTecnicoSimplificado = formatoSegumientoTecnico
  .map((item) => {
    const { variable, descripcion, referencia, ...resto } = item;
    const nuevoObjeto = { ...referencia };
    return nuevoObjeto;
  })
  .reduce((acc, item) => {
    return { ...acc, ...item.referencia };
  }, {});

export {
  formatoSegumientoActitudinales,
  formatoSegumientoTecnico,
  formatoSegumientoActitudinalesSimplificado,
  formatoSegumientoTecnicoSimplificado,
};
