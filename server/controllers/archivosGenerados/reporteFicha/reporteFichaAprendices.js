import models from '../../../models/index.js';
const { FichaAprendiz, Empresa, Usuario, Bitacora, Agendamiento, Ficha } =
  models;

export const reporteFichaAprendices = async (req) => {
  const { reportes, ficha, aprendiz, empresa } = req.body;
  const { bitacorasAprobadas = true, visitasRealizadas = true } = reportes;

  const filtrosAprendiz = Object.entries(aprendiz)
    .filter(([_, valor]) => valor)
    .map(([campo]) => campo);
  if (filtrosAprendiz.includes('nombre')) {
    filtrosAprendiz.push('apellido');
  }

  const filtroEmpresa = Object.entries(empresa)
    .filter(([_, valor]) => valor)
    .map(([campo]) => campo);

  const fichaAprendiz = await FichaAprendiz.findAll({
    where: { idFicha: ficha },
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

  return {
    fichaInfoDisponible: true,
    cantidadAprendices: fichaAprendiz.length,
    infoFicha,
    fichaAprendiz,
    filtrosAprendiz,
    filtroEmpresa,
  };
};
