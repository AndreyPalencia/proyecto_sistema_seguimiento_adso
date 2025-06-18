import models from '../../../models/index.js';
const { FichaAprendiz, Empresa, Usuario, Agendamiento, Ficha } = models;
import ApiResponse from '../../../utils/apiResponse.js';
import { Op, fn, col, where } from 'sequelize';
import PDFDocument from 'pdfKit';

export const reporteAprendicesSinAgendamientos = async (req, res) => {
  try {
    const { idInstructor } = req.params;

    const { fechaInicio: fechaInicioReporte, fechaFin: fechaFinReporte } =
      req.body;

    const fichasInstructor = await Ficha.findAll({
      where: { idInstructor, estadoFicha: 1 },
    });
    if (!fichasInstructor || fichasInstructor.length === 0) {
      return ApiResponse.notFound(
        res,
        'No se encontraron fichas activias para realizar la busqueda.'
      );
    }
    const aprendicesSinAgendamientosRaw = await Promise.all(
      fichasInstructor.map(async (ficha) => {
        const { idFicha } = ficha;
        const aprendicesFicha = await FichaAprendiz.findAll({
          where: {
            idFicha: idFicha,
          },
          include: [
            {
              model: Agendamiento,
              where: where(fn('DATE', col('fecha_inicio')), {
                [Op.between]: [fechaFinReporte, fechaInicioReporte],
              }),
              attributes: [],
            },
          ],
        });

        const idsConAgendamientos = aprendicesFicha.map(
          (a) => a?.idFichaAprendiz
        );

        const aprendicesSinVisitas = await FichaAprendiz.findAll({
          where: {
            idFicha: idFicha,
            idFichaAprendiz: {
              [Op.notIn]: idsConAgendamientos.length
                ? idsConAgendamientos
                : [0],
            },
          },
          attributes: {
            exclude: ['idUsuario', 'idFicha', 'idEmpresa', 'idFichaAprendiz'],
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
          idFicha,
        };
      })
    );

    // Filter out entries where aprendicesSinVisitas is empty
    const aprendicesSinAgendamientos = aprendicesSinAgendamientosRaw.filter(
      (item) => item.aprendicesSinVisitas.length > 0
    );

    ////////////////////////////////////////////////////////////////
  
    try {
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
        layout: 'landscape',
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=reporte.pdf');
      doc.pipe(res);

      aprendicesSinAgendamientos.forEach(
        ({ aprendicesSinVisitas }, indexFicha) => {
          aprendicesSinVisitas.forEach((aprendiz, index) => {
            const secciones = [
              {
                titulo: 'Información del Aprendiz',
                datos: {
                  Nombre: aprendiz.usuario?.nombre,
                  Correo: aprendiz.usuario?.correo,
                  Teléfono: aprendiz.usuario?.telefono,
                },
              },
              {
                titulo: 'Información de la Empresa',
                datos: {
                  'Nombre Empresa': aprendiz.empresa?.nombre,
                  Dirección: aprendiz.empresa?.direccion,
                  'Teléfono Empresa': aprendiz.empresa?.telefono,
                },
              },
              {
                titulo: 'Etapa Práctica',
                datos: {
                  'Fecha Inicio': aprendiz.etapa?.fechaInicio,
                  'Fecha Fin': aprendiz.etapa?.fechaFin,
                  Estado: aprendiz.etapa?.estado,
                },
              },
            ];

            secciones.forEach((sec) => {
              if (!sec.datos || typeof sec.datos !== 'object') return;

              doc
                .font('Helvetica-Bold')
                .fontSize(12)
                .fillColor('black')
                .text(sec.titulo, { align: 'left' });

              doc.moveDown(0.5);
              const yStart = doc.y;

              Object.entries(sec.datos).forEach(([key, value], i) => {
                const y = yStart + i * 20;

                doc
                  .font('Helvetica-Bold')
                  .fontSize(10)
                  .fillColor('#444444')
                  .text(`${key}:`, 50, y);

                doc
                  .font('Helvetica')
                  .fontSize(10)
                  .fillColor('black')
                  .text(`${value ?? 'N/A'}`, 150, y);
              });

              doc.moveDown(2);
            });

            // Add page unless it's the last entry
            if (
              index < aprendicesSinVisitas.length - 1 ||
              indexFicha < aprendicesSinAgendamientos.length - 1
            ) {
              doc.addPage();
            }
          });
        }
      );
      

      doc.end();
    } catch (error) {
      res.destroy(); // Cerramos la conexión si algo falla antes de doc.end()
      console.error('Error al generar PDF:', error);
    }

    //return ApiResponse.success(res, aprendicesSinAgendamientos, 'Okey');
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
