import models from '../../../models/index.js';
const { FichaAprendiz, Empresa, Usuario, Bitacora, Agendamiento, Ficha } =
  models;

export const reporteFichaAprendices = async (req) => {
  const { reportes, ficha, aprendiz, empresa } = req.body;
  const { bitacorasAprobadas = true, visitasRealizadas = true } = reportes;
  const { jefeInmediato, ...restEmpresa } = empresa;

  // Filtros dinámicos para Empresa
  const filtroEmpresa = Object.entries(restEmpresa)
    .filter(([_, valor]) => valor)
    .map(([campo]) => campo);

  // Filtros dinámicos para Aprendiz
  const filtrosAprendiz = Object.entries(aprendiz)
    .filter(([_, valor]) => valor)
    .map(([campo]) => campo);
  if (filtrosAprendiz.includes('nombre')) {
    filtrosAprendiz.push('apellido');
  }

  // Atributos dinámicos de FichaAprendiz
  const atributosFichaAprendiz = [
    'idUsuario',
    'idFicha',
    'idEmpresa',
    'cargoEmpresa',
  ];
  if (jefeInmediato) {
    atributosFichaAprendiz.push('jefeInmediato');
  }

  // Consulta principal
  const fichaAprendiz = await FichaAprendiz.findAll({
    where: { idFicha: ficha },
    attributes: atributosFichaAprendiz,
    include: [
      { model: Usuario, attributes: filtrosAprendiz },
      { model: Empresa, attributes: filtroEmpresa },
      {
        model: Bitacora,
        attributes: ['numeroBitacora'],
        where: { estadoBitacora: bitacorasAprobadas },
        required: false,
      },
      {
        model: Agendamiento,
        attributes: ['numeroVisita'],
        where: visitasRealizadas ? { estadoVisita: 'Realizada' } : undefined,
        required: false,
      },
    ],
  });

  const infoFicha = await Ficha.findByPk(ficha, {
    include: [
      {
        model: Usuario,
        attributes: [
          'numeroDocumento',
          'nombre',
          'apellido',
          'correoElectronico',
        ],
      },
    ],
  });

  if (!infoFicha || fichaAprendiz.length === 0) {
    // Devuelve null si no hay datos suficientes
    return null;
  }

  // Si se pidió jefeInmediato, añadirlo al objeto Empresa en cada resultado
  if (jefeInmediato) {
    fichaAprendiz.forEach((item) => {
      if (item.Empresa && item.jefeInmediato) {
        item.Empresa.jefeInmediato = item.jefeInmediato;
      }
    });
  }

  if (jefeInmediato) {
    filtroEmpresa.push('jefeInmediato');
  }

  return {
    fichaInfoDisponible: true,
    cantidadAprendices: fichaAprendiz.length,
    infoFicha,
    fichaAprendiz,
    filtrosAprendiz,
    filtroEmpresa,
  };
};
