import models from '../../../models/index.js';
const { FichaAprendiz, Empresa, Usuario, Agendamiento, Ficha } = models;
import ApiResponse from '../../../utils/apiResponse.js';
import { Op, fn, col, where } from 'sequelize';

export const reporteAprendicesSinAgendamientos = async (req, res) => {
  try {
    const { idInstructor } = req.params;
    const { fechaInicio: fechaInicioReporte, fechaFin: fechaFinReporte } =
      req.body;

    // Validar que las fechas estén presentes
    if (!fechaInicioReporte || !fechaFinReporte) {
      return ApiResponse.badRequest(
        res,
        'Las fechas de inicio y fin son requeridas.'
      );
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
      return ApiResponse.notFound(
        res,
        'No se encontraron fichas activas para realizar la búsqueda.'
      );
    }

    const aprendicesSinAgendamientosRaw = await Promise.all(
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
              where: {
                [Op.and]: [
                  where(fn('DATE', col('Agendamientos.fecha_inicio')), {
                    [Op.between]: [fechaFinReporte, fechaInicioReporte],
                  }),
                ],
              },
              attributes: [], // Solo necesitamos saber que existe
              required: true, // INNER JOIN - solo los que tienen agendamientos
            },
          ],
          attributes: ['idFichaAprendiz'],
        });

        // Obtener IDs de aprendices que SÍ tienen agendamientos
        const idsConAgendamientos = aprendicesConAgendamientos.map(
          (a) => a.idFichaAprendiz
        );

        // Buscar aprendices SIN agendamientos (los que no están en la lista anterior)
        const aprendicesSinVisitas = await FichaAprendiz.findAll({
          where: {
            idFicha,
            ...(idsConAgendamientos.length > 0 && {
              idFichaAprendiz: {
                [Op.notIn]: idsConAgendamientos,
              },
            }),
          },
          attributes: {
            exclude: ['idUsuario', 'idFicha', 'idEmpresa'],
          },
          include: [
            {
              model: Empresa,
              attributes: {
                exclude: ['idEmpresa'],
              },
            },
            {
              model: Usuario,
              attributes: {
                exclude: [
                  'idUsuario',
                  'firma',
                  'rol',
                  'password',
                  'estadoUsuario',
                ],
              },
            },
          ],
        });

        return {
          aprendicesSinVisitas,
          ficha: {
            idFicha: ficha.idFicha,
            numeroFicha: ficha.numeroFicha,
            nombrePrograma: ficha.nombrePrograma,
            terminoPrograma: ficha.terminoPrograma,
            inicioEtapaProductiva: ficha.inicioEtapaProductiva,
            finEtapaProductiva: ficha.finEtapaProductiva,
            estadoFicha: ficha.estadoFicha,
          },
          infoInstructor: {
            correoElectronico: instructorEmail,
            nombre: instructorName,
          },
        };
      })
    );

    // Filtrar resultados que tengan al menos un aprendiz sin agendamiento
    const aprendicesSinAgendamientos = aprendicesSinAgendamientosRaw.filter(
      (item) => item.aprendicesSinVisitas.length > 0
    );

    // Si no se encontraron datos después del filtro
    if (aprendicesSinAgendamientos.length === 0) {
      return ApiResponse.notFound(
        res,
        'No se encontraron aprendices sin agendamientos en el rango de fechas indicado.'
      );
    }

    return aprendicesSinAgendamientos;
  } catch (error) {
    console.error(
      'Error al generar el reporte de aprendices sin agendamientos: ',
      error
    );
    return ApiResponse.error(
      res,
      error,
      'Error al generar el reporte de aprendices sin agendamientos'
    );
  }
};
