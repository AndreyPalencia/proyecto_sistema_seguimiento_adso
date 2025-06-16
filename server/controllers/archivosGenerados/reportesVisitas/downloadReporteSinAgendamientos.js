import PDFDocument from 'pdfkit';
import ApiResponse from '../../../utils/apiResponse.js';
import { reporteAprendicesSinAgendamientos } from './reporteAprendicesSinAgendamientos.js';

export const downloadReporteSinAgendamiento = async (req, res) => {
  try {
    const { fechaInicio: fechaInicioReporte, fechaFin: fechaFinReporte } =
      req.body;

    const aprendicesSinAgendamientos = await reporteAprendicesSinAgendamientos(
      req,
      res
    );

    const doc = new PDFDocument({
      size: 'LETTER',
      layout: 'landscape',
      margin: 30,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Reporte_Sin_Visitas_Aprendices_${fechaInicioReporte}_${fechaFinReporte}.pdf"`
    );
    doc.pipe(res);

    // ─────── Constants ───────
    const xStart = 30;
    const rowHeight = 36;
    const marginTop = 30;
    const marginBottom = 30;
    const pageHeight = doc.page.height;
    const availableHeight = pageHeight - marginTop - marginBottom;
    const availableWidth = 732;

    const aprendizHeaders = [
      'TIPO DOCUMENTO',
      'NÚMERO DOCUMENTO',
      'NOMBRE',
      'APELLIDO',
      'TELÉFONO',
      'CORREO ELECTRÓNICO',
    ];
    const empresaHeaders = [
      'NIT',
      'RAZÓN SOCIAL',
      'TELÉFONO EMPRESA',
      'CORREO EMPRESA',
      'DIRECCIÓN',
    ];
    const etapaPracticaHeaders = [
      'ALTERNATIVA',
      'CARGO EMPRESA',
      'JEFE INMEDIATO',
      'TELÉFONO JEFE',
      'CORREO JEFE',
      'CARGO JEFE',
    ];

    const headers = [
      ...aprendizHeaders,
      ...empresaHeaders,
      ...etapaPracticaHeaders,
    ];
    const colWidth = Math.floor(availableWidth / headers.length);
    const colWidths = headers.map(() => colWidth);

    const secciones = [
      { title: 'Información Aprendiz', count: aprendizHeaders.length },
      { title: 'Información Empresa', count: empresaHeaders.length },
      {
        title: 'Información Etapa Práctica',
        count: etapaPracticaHeaders.length,
      },
    ];

    // ─────── Begin Rendering PDF ───────
    let y = doc.y;

    for (const [
      indexFicha,
      { ficha, aprendicesSinVisitas, infoInstructor },
    ] of aprendicesSinAgendamientos.entries()) {
      if (indexFicha > 0) {
        doc.addPage();
        y = doc.y;
      }

      // ─────── Título sección ───────
      doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .text(
          `Reporte Aprendices Sin Solicitar Visita:  ${ficha.nombrePrograma} - ${ficha.numeroFicha} - Fechas: ${fechaInicioReporte} - ${fechaFinReporte}`,
          {
            align: 'center',
          }
        );

      y += 45;

      // ─────── Tabla ficha info ───────
      const datosFicha = [
        ['Número Ficha', ficha.numeroFicha],
        ['Nombre Programa', ficha.nombrePrograma],
        ['Término Programa', ficha.terminoPrograma],
        ['Estado Ficha', ficha.estadoFicha ? 'Activa' : 'Inactiva'],
        ['Inicio Etapa Productiva', ficha.inicioEtapaProductiva],
        ['Fin Etapa Productiva', ficha.finEtapaProductiva],
        ['Fecha Inicio Reporte', fechaInicioReporte],
        ['Fecha Fin Reporte', fechaFinReporte],
        ['Instructor', infoInstructor?.nombre],
        ['Correo Electronico instructor', infoInstructor?.correoElectronico],
      ];

      const maxPairsPerRow = 4;
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

      // ─────── Sección: Headers Agrupados y Columnas ───────
      const drawSectionHeaders = () => {
        let x = xStart;
        let colIndex = 0;
        doc.font('Helvetica-Bold').fontSize(9);
        secciones.forEach(({ title, count }) => {
          const width = colWidths
            .slice(colIndex, colIndex + count)
            .reduce((sum, w) => sum + w, 0);
          doc.rect(x, y, width, rowHeight).fillAndStroke('#eeeeee', 'black');
          doc.fillColor('black').text(title, x, y + 10, {
            width,
            align: 'center',
          });
          x += width;
          colIndex += count;
        });
        y += rowHeight;
      };

      const drawColumnHeaders = () => {
        let x = xStart;
        doc.font('Helvetica-Bold').fontSize(8);
        headers.forEach((header, i) => {
          const width = colWidths[i];
          doc.rect(x, y, width, rowHeight).stroke();
          doc.text(header, x + 2, y + 10, {
            width: width - 4,
            align: 'center',
          });
          x += width;
        });
        y += rowHeight;
      };

      drawSectionHeaders();
      drawColumnHeaders();

      // ─────── Filas de datos ───────
      doc.font('Helvetica').fontSize(8);
      for (const a of aprendicesSinVisitas) {
        if (y + rowHeight > availableHeight) {
          doc.addPage();
          y = marginTop;
          drawSectionHeaders();
          drawColumnHeaders();
          doc.font('Helvetica').fontSize(8);
        }

        const row = [
          a.Usuario.tipoDocumento,
          a.Usuario.numeroDocumento,
          a.Usuario.nombre,
          a.Usuario.apellido,
          a.Usuario.telefono,
          a.Usuario.correoElectronico,
          a.Empresa.nit,
          a.Empresa.razonSocial,
          a.Empresa.telefono,
          a.Empresa.correoElectronico,
          a.Empresa.direccion,
          a.alternativa,
          a.cargoEmpresa,
          a.jefeInmediato,
          a.telefonoJefe,
          a.correoElectronicoJefe,
          a.cargoJefe,
        ];

        let x = xStart;
        row.forEach((cell, i) => {
          const width = colWidths[i];
          doc.rect(x, y, width, rowHeight).stroke();
          doc.text(String(cell ?? '-'), x + 2, y + 10, {
            width: width - 4,
            align: 'center',
          });
          x += width;
        });

        y += rowHeight;
      }

      y += 20;
    }

    // ─────── Nota Final ───────
    doc
      .font('Helvetica-Oblique')
      .fontSize(9)
      .fillColor('gray')
      .text(
        'Nota: Este reporte solo muestra los aprendices SIN visitas cuya ficha esté activa. La cantidad de aprendices puede variar dependiendo del rango de fechas seleccionado. ' +
          'Si un aprendiz solicitó una visita dentro del rango indicado, no aparecerá en el reporte, incluso si no tiene otras solicitudes fuera de ese periodo.',
        xStart,
        y,
        {
          width: availableWidth,
          align: 'justify',
        }
      );

    doc.end();
  } catch (error) {
    console.error('Error al generar PDF:', error);
    return ApiResponse.error(
      res,
      error,
      'Error al descargar el reporte de aprendices sin visitas.'
    );
  }
};
