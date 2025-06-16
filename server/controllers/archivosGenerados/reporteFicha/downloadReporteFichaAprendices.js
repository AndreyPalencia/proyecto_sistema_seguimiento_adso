import models from '../../../models/index.js';
const { FichaAprendiz, Empresa, Usuario, Bitacora, Agendamiento, Ficha } =
  models;
import ApiResponse from '../../../utils/apiResponse.js';
import PDFDocument from 'pdfkit';
import { reporteFichaAprendices } from './reporteFichaAprendices.js';

// Función para separar palabras tipo camelCase o concatenadas
const formatearTitulo = (texto) =>
  texto
    .replace(/([a-z])([A-Z])/g, '$1 $2') // nombreCompleto → nombre Completo
    .replace(/_/g, ' ') // nombre_completo → nombre completo
    .toUpperCase();

export const downloadReporteFichaAprendices = async (req, res) => {
  try {
    const { reportes } = req.body;
    const { numeroBitacoras = 0, numeroVisitas = 0 } = reportes;

    const { infoFicha, fichaAprendiz, filtrosAprendiz, filtroEmpresa } =
      await reporteFichaAprendices(req, res);

    const doc = new PDFDocument({
      size: 'LETTER',
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

    /// Dato ficha
    const fichaInfoTop = doc.y;
    const startX = 30;
    const pageWidth = doc.page.width;
    const usableWidth = pageWidth - 60;
    const maxParesPorFila = 4;
    const totalCells = maxParesPorFila * 2;
    const cellWidth = usableWidth / totalCells;
    const rowHeight = 35;

    // Pares de etiqueta y valor
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

      // Fondo + borde de la celda de etiqueta
      doc
        .fillColor('#eeeeee')
        .rect(xLabel, y, cellWidth, rowHeight)
        .fillAndStroke();

      // Texto de etiqueta
      doc
        .fillColor('black')
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(label + ':', xLabel + 4, y + 6, {
          width: cellWidth - 8,
          align: 'left',
        });

      // Celda de valor (sin fondo)
      doc
        .fillColor('white') // Puedes omitir si es fondo blanco
        .rect(xValue, y, cellWidth, rowHeight)
        .stroke();

      // Texto de valor
      doc
        .fillColor('black')
        .font('Helvetica')
        .fontSize(8)
        .text(String(value), xValue + 4, y + 6, {
          width: cellWidth - 8,
          align: 'left',
        });
    });

    doc.moveDown(4);

    ///Tabla de info de aprendices

    const numerosBitacoras = Array.from(
      { length: numeroBitacoras },
      (_, i) => i + 1
    );
    const numerosVisitas = Array.from(
      { length: numeroVisitas },
      (_, i) => i + 1
    );

    //Cabeceraas
    const aprendizHeaders = [
      'NOMBRE COMPLETO',
      ...filtrosAprendiz
        .filter((f) => f !== 'nombre' && f !== 'apellido')
        .map(formatearTitulo),
    ];
    const empresaHeaders = filtroEmpresa.map(formatearTitulo);
    const bitacoraHeaders = numerosBitacoras.map((n) => `B${n}`);
    const visitaHeaders = numerosVisitas.map((n) => `V${n}`);

    const colHeaders = [
      ...aprendizHeaders,
      ...empresaHeaders,
      ...bitacoraHeaders,
      ...visitaHeaders,
    ];

    const datos = fichaAprendiz.map((fa) => {
      const usuario = fa.Usuario || {};
      const empresa = fa.Empresa || {};
      //console.log('Nombre:', usuario.nombre, 'Apellido:', usuario.apellido); // <--- Agrega esto

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
      const bitacoras = numerosBitacoras.map((n) =>
        fa.Bitacoras.some((b) => b.numeroBitacora === n) ? 'X' : ''
      );
      const visitas = numerosVisitas.map((n) =>
        fa.Agendamientos.some((v) => v.numeroVisita === n) ? 'X' : ''
      );

      return [...aprendizData, ...empresaData, ...bitacoras, ...visitas];
    });

    // Definir anchos base
    let anchoGrande = 80;
    const anchoPequeno = 25;

    // Calcular total con base en los anchos actuales
    const totalColumnasGrandes = aprendizHeaders.length + empresaHeaders.length;
    const totalColumnasPequenas = bitacoraHeaders.length + visitaHeaders.length;
    const totalAnchoPrevisto =
      anchoGrande * totalColumnasGrandes + anchoPequeno * totalColumnasPequenas;

    const anchoDisponible = 782; // A4 landscape menos márgenes

    // Ajuste proporcional si excede ancho disponible
    if (totalAnchoPrevisto > anchoDisponible) {
      const anchoRestante =
        anchoDisponible - anchoPequeno * totalColumnasPequenas;
      anchoGrande = Math.floor(anchoRestante / totalColumnasGrandes);
    }

    const colWidths = [
      ...aprendizHeaders.map(() => anchoGrande),
      ...empresaHeaders.map(() => anchoGrande),
      ...bitacoraHeaders.map(() => anchoPequeno),
      ...visitaHeaders.map(() => anchoPequeno),
    ];

    //const startX = 30;
    let y = doc.y;
    const cellHeight = 38;

    // Títulos de secciones
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
      {
        title: 'Bitácoras',
        count: bitacoraHeaders.length,
        width: anchoPequeno,
      },
      { title: 'Visitas', count: visitaHeaders.length, width: anchoPequeno },
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

    // Encabezados
    x = startX;
    doc.font('Helvetica-Bold').fontSize(7); // <== aquí se baja la fuente a 8

    colHeaders.forEach((header, i) => {
      const width = colWidths[i];
      doc.rect(x, y, width, cellHeight).stroke();
      doc.text(header, x + 2, y + 10, { width: width - 4, align: 'center' });
      x += width;
    });

    y += cellHeight;

    // Datos
    doc.font('Helvetica').fontSize(9);

    const margenSuperior = 30;
    const margenInferior = 30;
    const altoPagina = doc.page.height;
    const altoDisponible = altoPagina - margenSuperior - margenInferior;
    const altoCelda = 38; // Altura de cada fila

    datos.forEach((row) => {
      // Verificar si la siguiente fila cabe en la página actual
      if (y + altoCelda > altoDisponible) {
        doc.addPage();

        y = margenSuperior;

        // Redibujar títulos de secciones
        x = startX;
        doc.font('Helvetica-Bold').fontSize(10);
        secciones.forEach((sec) => {
          const totalWidth = sec.count * sec.width;
          doc
            .rect(x, y, totalWidth, altoCelda)
            .fillAndStroke('#eeeeee', 'black');
          doc
            .fillColor('black')
            .text(sec.title, x, y + 10, { width: totalWidth, align: 'center' });
          x += totalWidth;
        });

        y += altoCelda;

        // Redibujar encabezados
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

      // Dibujar la fila de datos
      x = startX;
      row.forEach((cell, i) => {
        const width = colWidths[i];
        doc.font('Helvetica').fontSize(9); // Set the font and size again

        doc.rect(x, y, width, altoCelda).stroke();
        doc.text(cell, x + 2, y + 10, { width: width - 4, align: 'center' });
        x += width;
      });
      y += altoCelda;
    });

    // Add some space after the last table row
    y += 20;

    // Set font style and size for the note
    doc.font('Helvetica-Oblique').fontSize(10);

    // Write the note below the table
    doc.text(
      `Note: Si en el formulario de creación del reporte se selecciona “bitácoras aprobadas”, solo se marcarán las bitácoras aprobadas en el sistema. Si no, solo se marcarán las que no están aprobadas. En agendamiento, si se marca “agendamiento realizado”, solo se mostrarán los agendamientos con estado realizado. Si no, se mostrarán todos los agendamientos sin importar su estado.`,
      startX, // same left margin as table
      y,
      { width: doc.page.width - 2 * startX, align: 'left' }
    );

    doc.end();

    //console.log(infoFicha.Usuario);
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    return ApiResponse.error(res, error, 'Error al generar el PDF');
  }
};
