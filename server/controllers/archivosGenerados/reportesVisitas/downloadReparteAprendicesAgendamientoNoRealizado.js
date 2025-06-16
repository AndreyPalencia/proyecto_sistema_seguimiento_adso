import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { reporteAprendicesAgendamientosNoRelizados } from './reporteAprendicesAgendamientoNoRealizados.js';
import ApiResponse from '../../../utils/apiResponse.js';

export const downloadReporteAprendicesAgendamientosNoRelizados = async (
  req,
  res
) => {
  try {
    const { fechaInicio: fechaInicioReporte, fechaFin: fechaFinReporte } =
      req.body;

    // Suponiendo que tienes una función para obtener los datos
    const fichasConAgendamientos =
      await reporteAprendicesAgendamientosNoRelizados(req, res);

    const doc = new PDFDocument({
      size: 'LETTER',
      layout: 'landscape',
      margin: 30,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Reporte_Aprendices_Agendamientos_No_Realizados_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf"`
    );
    doc.pipe(res);

    const xStart = 30;
    const rowHeight = 20;
    const marginTop = 30;
    const marginBottom = 30;
    const pageHeight = doc.page.height;
    const availableHeight = pageHeight - marginTop - marginBottom;
    const availableWidth = doc.page.width - xStart * 2;

    const aprendizHeaders = [
      'TIPO DOCUMENTO',
      'NÚMERO DOCUMENTO',
      'NOMBRE',
      'APELLIDO',
    ];
    const agendamientoHeaders = [
      'FECHA INICIO',
      'FECHA FIN',
      'ESTADO VISITA',
      'TIPO VISITA',
      'NÚMERO VISITA',
    ];

    const headers = [...aprendizHeaders, ...agendamientoHeaders];
    const colWidth = Math.floor(availableWidth / headers.length);
    const colWidths = headers.map(() => colWidth);

    const secciones = [
      { title: 'Información Aprendiz', count: aprendizHeaders.length },
      { title: 'Información Agendamientos', count: agendamientoHeaders.length },
    ];

    let y = doc.y;

    for (const [
      indexFicha,
      { ficha, aprendicesConAgendamientos, infoInstructor },
    ] of fichasConAgendamientos.entries()) {
      if (indexFicha > 0) {
        doc.addPage();
        y = doc.y;
      }

      // Título de la ficha
      doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text(
          `Reporte Aprendices Pendientes Por Visitas: ${
            ficha.nombrePrograma
          } - ${ficha.numeroFicha} ${
            fechaInicioReporte && fechaFinReporte
              ? ` - Fechas: ${fechaInicioReporte} - ${fechaFinReporte}`
              : ''
          }`,
          {
            align: 'center',
          }
        );

      y += 30;

      // Información de la ficha
      if (!infoInstructor) console.warn('Instructor info is missing');

      const datosFicha = [
        ['Número Ficha', ficha.numeroFicha],
        ['Nombre Programa', ficha.nombrePrograma],
        ['Término Programa', ficha.terminoPrograma],
        ['Instructor', infoInstructor?.nombre ?? 'No definido'],
        [
          'Correo Electrónico Instructor',
          infoInstructor?.correoElectronico ?? 'No definido',
        ],
      ];

      if (fechaInicioReporte) {
        datosFicha.push(['Fecha Inicio Reporte', fechaInicioReporte]);
      }
      if (fechaFinReporte) {
        datosFicha.push(['Fecha Fin Reporte', fechaFinReporte]);
      }

      const maxPairsPerRow = 3;
      const totalCells = maxPairsPerRow * 2;
      const cellWidth = availableWidth / totalCells;
      const rowHeightFicha = 30;
      const yStartFicha = y + 10;

      datosFicha.forEach(([label, value], index) => {
        const row = Math.floor(index / maxPairsPerRow);
        const col = index % maxPairsPerRow;
        const xLabel = xStart + col * 2 * cellWidth;
        const xValue = xLabel + cellWidth;
        const yPos = yStartFicha + row * rowHeightFicha;

        doc
          .fillColor('#eeeeee')
          .rect(xLabel, yPos, cellWidth, rowHeightFicha)
          .fillAndStroke();

        doc
          .fillColor('black')
          .font('Helvetica-Bold')
          .fontSize(9)
          .text(`${label}:`, xLabel + 4, yPos + 8, {
            width: cellWidth - 8,
            align: 'left',
          });

        doc.rect(xValue, yPos, cellWidth, rowHeightFicha).stroke();
        doc.fillColor('black').font('Helvetica').fontSize(8);

        doc.text(String(value ?? '-'), xValue + 4, yPos + 8, {
          width: cellWidth - 8,
          align: 'left',
          ellipsis: true,
        });
      });

      y =
        yStartFicha +
        Math.ceil(datosFicha.length / maxPairsPerRow) * rowHeightFicha +
        20;

      // Encabezados agrupados
      const drawSectionHeaders = () => {
        let x = xStart;
        let colIndex = 0;
        doc.font('Helvetica-Bold').fontSize(9);
        secciones.forEach(({ title, count }) => {
          const width = colWidths
            .slice(colIndex, colIndex + count)
            .reduce((sum, w) => sum + w, 0);
          doc.rect(x, y, width, rowHeight).fillAndStroke('#eeeeee', 'black');
          doc.fillColor('black').text(title, x, y + 5, {
            width,
            align: 'center',
          });
          x += width;
          colIndex += count;
        });
        y += rowHeight;
      };

      // Encabezados de columnas
      const drawColumnHeaders = () => {
        let x = xStart;
        doc.font('Helvetica-Bold').fontSize(8);
        headers.forEach((header, i) => {
          const width = colWidths[i];
          doc.rect(x, y, width, rowHeight).stroke();
          doc.text(header, x + 2, y + 5, {
            width: width - 4,
            align: 'center',
          });
          x += width;
        });
        y += rowHeight;
      };

      drawSectionHeaders();
      drawColumnHeaders();

      // Filas de datos
      doc.font('Helvetica').fontSize(8);
      for (const aprendiz of aprendicesConAgendamientos) {
        const { Usuario, Agendamientos } = aprendiz;

        for (const agendamiento of Agendamientos) {
          if (y + rowHeight > availableHeight) {
            doc.addPage();
            y = marginTop;
            drawSectionHeaders();
            drawColumnHeaders();
            doc.font('Helvetica').fontSize(8);
          }

          const row = [
            Usuario.tipoDocumento,
            Usuario.numeroDocumento,
            Usuario.nombre,
            Usuario.apellido,
            format(new Date(agendamiento.fechaInicio), 'dd/MM/yyyy HH:mm', {
              locale: es,
            }),
            format(new Date(agendamiento.fechaFin), 'dd/MM/yyyy HH:mm', {
              locale: es,
            }),
            agendamiento.estadoVisita,
            agendamiento.tipoVisita,
            agendamiento.numeroVisita,
          ];

          let x = xStart;
          row.forEach((cell, i) => {
            const width = colWidths[i];
            doc.rect(x, y, width, rowHeight).stroke();
            doc.text(String(cell ?? '-'), x + 2, y + 5, {
              width: width - 4,
              align: 'center',
            });
            x += width;
          });

          y += rowHeight;
        }
      }

      y += 20;
    }

    doc.moveDown(2); // Espacio antes de la nota

    doc
      .font('Helvetica-Oblique')
      .fontSize(9)
      .fillColor('gray')
      .text(
        `Nota: Si selecciona un rango de fechas, solo se mostrarán los registros de agendamiento que no estén marcados como "Realizado" dentro de ese rango. Si elige "Todos los Agendamientos", se mostrarán todos los agendamientos relacionados con las fichas activas del instructor cuyo estado no esté marcado como "Realizado". Este reporte se genera únicamente para fichas activas.`,
        xStart,
        y,
        {
          width: availableWidth,
          align: 'justify',
        }
      );

    doc.end();
  } catch (error) {
    console.error(
      'Error al generar el reporte de aprendices con agendamientos sin realizar: ',
      error
    );
    return ApiResponse.error(
      res,
      error,
      error.message ||
        'Error al generar el reporte de aprendices con agendamientos sin realizar.'
    );
  }
};
