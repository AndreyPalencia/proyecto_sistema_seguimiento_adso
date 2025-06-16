import models from '../../../models/index.js';
const { FichaAprendiz, Usuario, Agendamiento, Ficha } = models;
import ApiResponse from '../../../utils/apiResponse.js';
import { Op, fn, col, where } from 'sequelize';

export const reporteAprendicesAgendamientosNoRelizados = async (req, res) => {
  const { idInstructor } = req.params;
  const {
    fechaInicio: fechaInicioReporte,
    fechaFin: fechaFinReporte,
    ignoreDateFilter = false,
  } = req.body;

  console.log(req.body)
  if (!ignoreDateFilter && (!fechaInicioReporte || !fechaFinReporte)) {
    throw new Error('Las fechas de inicio y fin son requeridas.');
  }
  
  // Buscar fichas del instructor
  const fichasInstructor = await Ficha.findAll({
    where: {
      idInstructor: parseInt(idInstructor),
      estadoFicha: 1,
    },
    attributes: {
      exclude: ['fechaNotificacionEnvio'],
    },
    include: [
      {
        model: Usuario,
        attributes: ['correoElectronico', 'nombre', 'apellido'],
      },
    ],
  });

  if (!fichasInstructor || fichasInstructor.length === 0) {
    throw new Error(
      'No se encontraron fichas activas para realizar la búsqueda.'
    );
  }

  const condicionesWhere = {};

  if (ignoreDateFilter) {
    condicionesWhere.estadoVisita = {
      [Op.notIn]: ['Realizada'],
    };
  } else {
    condicionesWhere[Op.and] = [
      where(fn('DATE', col('Agendamientos.fecha_inicio')), {
        [Op.between]: [fechaInicioReporte, fechaFinReporte],
      }),
    ];
  }

  const aprendicesAgendamientosNoRealizadosRaw = await Promise.all(
    fichasInstructor.map(async (ficha) => {
      const { idFicha, Usuario: instructor } = ficha;

      const instructorEmail = instructor?.correoElectronico;
      const instructorName = `${instructor?.nombre} ${instructor?.apellido}`;

      // Buscar aprendices CON agendamientos en el rango de fechas
      const aprendicesConAgendamientos = await FichaAprendiz.findAll({
        where: { idFicha },
        include: [
          {
            model: Agendamiento,
            where: condicionesWhere,
            required: true, // INNER JOIN - solo los que tienen agendamientos
            attributes: [
              'fechaInicio',
              'fechaFin',
              'estadoVisita',
              'tipoVisita',
              'numeroVisita',
            ],
          },
          {
            model: Usuario,
            attributes: [
              'tipoDocumento',
              'numeroDocumento',
              'nombre',
              'apellido',
            ],
          },
        ],

        attributes: [],
      });

      return {
        aprendicesConAgendamientos,
        ficha: {
          idFicha: ficha.idFicha,
          numeroFicha: ficha.numeroFicha,
          nombrePrograma: ficha.nombrePrograma,
          terminoPrograma: ficha.terminoPrograma,
        },
        infoInstructor: {
          correoElectronico: instructorEmail,
          nombre: instructorName,
        },
      };
    })
  );

  // Filtrar resultados que tengan al menos un aprendiz sin agendamiento
  const aprendicesAgendamientosNoRealizados =
    aprendicesAgendamientosNoRealizadosRaw.filter(
      (item) => item.aprendicesConAgendamientos.length > 0
    );

  // Si no se encontraron datos después del filtro
  if (aprendicesAgendamientosNoRealizados.length === 0) {
    throw new Error(
      `No se encontraron aprendices con agendamientos no realizados ${
        !ignoreDateFilter
          ? 'en el rango de fechas indicado.'
          : 'en la base de datos.'
      }`
    );
  }

  return aprendicesAgendamientosNoRealizados;

  // return ApiResponse.success(
  //   res,
  //   aprendicesAgendamientosNoRealizados,
  //   'Okey'
  // );
};
