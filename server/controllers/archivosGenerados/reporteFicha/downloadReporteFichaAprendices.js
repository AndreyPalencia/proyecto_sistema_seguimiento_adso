// ... imports (sin cambios)
import models from '../../../models/index.js';
const { FichaAprendiz, Empresa, Usuario, Bitacora, Agendamiento, Ficha } =
  models;
import ApiResponse from '../../../utils/apiResponse.js';
import PDFDocument from 'pdfkit';
import { reporteFichaAprendices } from './reporteFichaAprendices.js';

const formatearTitulo = (texto) =>
  texto
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .toUpperCase();

export const downloadReporteFichaAprendices = async (req, res) => {
  try {
    const { reportes } = req.body;
    const numeroBitacoras = parseInt(reportes.numeroBitacoras) || 0;
    const numeroVisitas = parseInt(reportes.numeroVisitas) || 0;
    const datosReporte = await reporteFichaAprendices(req);

    if (!datosReporte) {
      throw new Error(
        'No se puede generar el reporte: no hay información suficiente.'
      );
    }

    const { infoFicha, fichaAprendiz, filtrosAprendiz, filtroEmpresa } =
      datosReporte;

    const doc = new PDFDocument({
      size: 'LEGAL',
      layout: 'landscape',
      margin: 30,
    });
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Reporte_Ficha_${infoFicha.numeroFicha}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf"`
    );
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    doc
      .fontSize(20)
      .text('Reporte de Ficha de Aprendices', { align: 'center' })
      .font('Helvetica-Bold');

    const fichaInfoTop = doc.y;
    const startX = 30;
    const pageWidth = doc.page.width;
    const usableWidth = pageWidth - 60;
    const maxParesPorFila = 4;
    const totalCells = maxParesPorFila * 2;
    const cellWidth = usableWidth / totalCells;
    const rowHeight = 35;

    const datosFicha = [
      ['Número Ficha', infoFicha.numeroFicha],
      ['Nombre Programa', infoFicha.nombrePrograma],
      ['Término Programa', infoFicha.terminoPrograma],
      ['Estado Ficha', infoFicha.estadoFicha ? 'Activa' : 'Inactiva'],
      ['Inicio Etapa Productiva', infoFicha.inicioEtapaProductiva],
      ['Fin Etapa Productiva', infoFicha.finEtapaProductiva],
      [
        'Instructor',
        `${infoFicha.Usuario?.nombre ?? ''} ${
          infoFicha.Usuario?.apellido ?? ''
        }`,
      ],
      ['Correo Electronico instructor', infoFicha.Usuario?.correoElectronico],
    ];

    const yStartCeldas = fichaInfoTop + 20;
    datosFicha.forEach(([label, value], index) => {
      const fila = Math.floor(index / maxParesPorFila);
      const columna = index % maxParesPorFila;
      const xLabel = startX + columna * 2 * cellWidth;
      const xValue = xLabel + cellWidth;
      const y = yStartCeldas + fila * rowHeight;
      doc
        .fillColor('#eeeeee')
        .rect(xLabel, y, cellWidth, rowHeight)
        .fillAndStroke();
      doc
        .fillColor('black')
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(label + ':', xLabel + 4, y + 6, { width: cellWidth - 8 });
      doc.fillColor('white').rect(xValue, y, cellWidth, rowHeight).stroke();
      doc
        .fillColor('black')
        .font('Helvetica')
        .fontSize(8)
        .text(String(value), xValue + 4, y + 6, { width: cellWidth - 8 });
    });

    doc.moveDown(4);

    const bitacoraHeaders = Array.from(
      { length: numeroBitacoras },
      (_, i) => `B${i + 1}`
    );
    const visitaHeaders = Array.from(
      { length: numeroVisitas },
      (_, i) => `V${i + 1}`
    );

    const aprendizHeaders = [
      'NOMBRE COMPLETO',
      ...filtrosAprendiz
        .filter((f) => f !== 'nombre' && f !== 'apellido')
        .map(formatearTitulo),
    ];
    const empresaHeaders = filtroEmpresa.map(formatearTitulo);
    const colHeaders = [
      ...aprendizHeaders,
      ...empresaHeaders,
      ...bitacoraHeaders,
      ...visitaHeaders,
    ];

    const datos = fichaAprendiz.map((fa) => {
      const usuario = fa.Usuario || {};
      const empresa = fa.Empresa || {};
      const nombreCompleto = `${usuario.nombre || ''} ${
        usuario.apellido || ''
      }`.trim();
      const aprendizData = [
        nombreCompleto,
        ...filtrosAprendiz
          .filter((f) => f !== 'nombre' && f !== 'apellido')
          .map((f) => usuario[f] || '-'),
      ];
      const empresaData = filtroEmpresa.map((f) => empresa[f] || '-');
      const bitacoras = bitacoraHeaders.map((h) =>
        fa.Bitacoras?.some((b) => `B${b.numeroBitacora}` === h) ? 'X' : ''
      );
      const visitas = visitaHeaders.map((v) =>
        fa.Agendamientos?.some((a) => `V${a.numeroVisita}` === v) ? 'X' : ''
      );
      return [...aprendizData, ...empresaData, ...bitacoras, ...visitas];
    });

    const anchoPequeno = 25;
    const totalColumnasGrandes = aprendizHeaders.length + empresaHeaders.length;
    const totalColumnasPequenas = bitacoraHeaders.length + visitaHeaders.length;
    const anchoDisponible = doc.page.width - 2 * startX;

    const anchoRestante =
      anchoDisponible - totalColumnasPequenas * anchoPequeno;
    const anchoGrande = Math.floor(anchoRestante / totalColumnasGrandes);

    const colWidths = [
      ...aprendizHeaders.map(() => anchoGrande),
      ...empresaHeaders.map(() => anchoGrande),
      ...bitacoraHeaders.map(() => anchoPequeno),
      ...visitaHeaders.map(() => anchoPequeno),
    ];

    let y = doc.y;
    const cellHeight = 38;
    let x = startX;

    const secciones = [
      {
        title: 'Información Aprendiz',
        count: aprendizHeaders.length,
        width: anchoGrande,
      },
      {
        title: 'Información Empresa',
        count: empresaHeaders.length,
        width: anchoGrande,
      },
      ...(bitacoraHeaders.length > 0
        ? [
            {
              title: 'Bitácoras',
              count: bitacoraHeaders.length,
              width: anchoPequeno,
            },
          ]
        : []),
      ...(visitaHeaders.length > 0
        ? [
            {
              title: 'Visitas',
              count: visitaHeaders.length,
              width: anchoPequeno,
            },
          ]
        : []),
    ];

    doc.font('Helvetica-Bold').fontSize(10);
    secciones.forEach((sec) => {
      const totalWidth = sec.count * sec.width;
      doc.rect(x, y, totalWidth, cellHeight).fillAndStroke('#eeeeee', 'black');
      doc
        .fillColor('black')
        .text(sec.title, x, y + 10, { width: totalWidth, align: 'center' });
      x += totalWidth;
    });

    y += cellHeight;
    x = startX;
    doc.font('Helvetica-Bold').fontSize(7);
    colHeaders.forEach((header, i) => {
      const width = colWidths[i];
      doc.rect(x, y, width, cellHeight).stroke();
      doc.text(header, x + 2, y + 10, { width: width - 4, align: 'center' });
      x += width;
    });

    y += cellHeight;
    doc.font('Helvetica').fontSize(9);

    const margenSuperior = 30;
    const margenInferior = 30;
    const altoPagina = doc.page.height;
    const altoDisponible = altoPagina - margenSuperior - margenInferior;
    const altoCelda = 38;

    datos.forEach((row) => {
      if (y + altoCelda > altoDisponible) {
        doc.addPage();
        y = margenSuperior;
        x = startX;
        doc.font('Helvetica-Bold').fontSize(10);
        secciones.forEach((sec) => {
          const totalWidth = sec.count * sec.width;
          doc
            .rect(x, y, totalWidth, altoCelda)
            .fillAndStroke('#eeeeee', 'black');
          doc.fillColor('black').text(sec.title, x, y + 10, {
            width: totalWidth,
            align: 'center',
          });
          x += totalWidth;
        });
        y += altoCelda;
        x = startX;
        doc.font('Helvetica-Bold').fontSize(7);
        colHeaders.forEach((header, i) => {
          const width = colWidths[i];
          doc.rect(x, y, width, altoCelda).stroke();
          doc.text(header, x + 2, y + 10, {
            width: width - 4,
            align: 'center',
          });
          x += width;
        });
        y += altoCelda;
      }

      x = startX;
      row.forEach((cell, i) => {
        const width = colWidths[i];
        doc.rect(x, y, width, altoCelda).stroke();
        doc.text(cell, x + 2, y + 10, { width: width - 4, align: 'center' });
        x += width;
      });
      y += altoCelda;
    });

    y += 20;
    doc.font('Helvetica-Oblique').fontSize(10);
    doc.text(
      `Note: Si en el formulario de creación del reporte se selecciona “bitácoras aprobadas”, solo se marcarán las bitácoras aprobadas en el sistema. Si no, solo se marcarán las que no están aprobadas. En agendamiento, si se marca “agendamiento realizado”, solo se mostrarán los agendamientos con estado realizado. Si no, se mostrarán todos los agendamientos sin importar su estado.`,
      startX,
      y,
      { width: doc.page.width - 2 * startX, align: 'left' }
    );

    doc.end();
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    return ApiResponse.error(res, error, 'Error al generar el PDF');
  }
};
