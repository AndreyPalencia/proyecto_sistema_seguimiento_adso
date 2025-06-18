import ApiResponse from '../../../utils/apiResponse.js';
import { getOptimizedRoute } from '../../../services/getOptimizedRoute.js';
import { reporteAgendamientosMaps } from './reporteAgedamientosMaps.js';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import axios from 'axios';
import PDFDocument from 'pdfkit';
import stream from 'stream';

const { GOOGLE_API_KEY } = process.env;

export const downloadReporteMaps = async (req, res) => {
  try {
    const { idInstructor } = req.params;
    const { fechaBusqueda } = req.body;

    // Fetch data: origin, destination, waypoints, and appointments
    const {
      origin,
      destination,
      waypoints,
      direccionesEmpresa,
      agendamientosResultado,
    } = await reporteAgendamientosMaps({ idInstructor, fechaBusqueda });

    // Get optimized route (polyline, order, etc.)
    const { polyline, order, summary, legs } = await getOptimizedRoute({
      origin,
      destination,
      waypoints,
    });

    // Prepare markers for Google Static Map
    const markers = [];
    if (origin) markers.push(`color:red|label:O|${origin}`);
    if (order && waypoints.length) {
      order.forEach((idx, i) => {
        markers.push(`color:red|label:${i + 1}|${waypoints[idx]}`);
      });
    }
    if (destination) markers.push(`color:red|label:D|${destination}`);

    const markersParam = markers
      .map((m) => `markers=${encodeURIComponent(m)}`)
      .join('&');

    // Build Google Static Map URL
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=800x600&path=enc:${polyline}&${markersParam}&key=${GOOGLE_API_KEY}`;

    // Fetch map image as arraybuffer
    const mapImageResponse = await axios.get(mapUrl, {
      responseType: 'arraybuffer',
    });

    // Create PDF document with landscape layout and consistent margins
    const doc = new PDFDocument({
      size: 'LETTER',
      layout: 'landscape',
      margin: 30,
    });

    const bufferStream = new stream.PassThrough();

    // Set response headers to send PDF as download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Reporte_Ruta_Agendamientos_${fechaBusqueda}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf"`
    );

    doc.pipe(bufferStream);
    bufferStream.pipe(res);

    // Page setup constants
    const xStart = 30;
    const rowHeight = 20;
    const marginTop = 30;
    const marginBottom = 30;
    const pageHeight = doc.page.height;
    const availableHeight = pageHeight - marginTop - marginBottom;
    const availableWidth = doc.page.width - xStart * 2;

    let y = doc.y;

    // Title
    doc
      .font('Helvetica-Bold')
      .fontSize(18)
      .text(
        `Reporte de Ruta y Agendamientos${
          fechaBusqueda ? ` - Fecha: ${fechaBusqueda}` : ''
        }`,
        {
          align: 'center',
        }
      );

    y += 40;

    // Route information section
    const datosRuta = [
      ['Origen', origin || 'No definido'],
      ['Destino', destination || 'No definido'],
      ['Número de Paradas', waypoints.length.toString()],
      ['Total Agendamientos', agendamientosResultado.length.toString()],
      [
        'Fecha de Generación',
        format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es }),
      ],
      ['Distancia Total', summary?.distance || 'No disponible'],
      ['Tiempo Estimado', summary?.duration || 'No disponible'],
    ];

    if (fechaBusqueda) {
      datosRuta.push(['Fecha Búsqueda', fechaBusqueda]);
    }

    // Draw route information in a table format
    const maxPairsPerRow = 3;
    const totalCells = maxPairsPerRow * 2;
    const cellWidth = availableWidth / totalCells;
    const rowHeightInfo = 25;
    const yStartInfo = y + 10;

    datosRuta.forEach(([label, value], index) => {
      const row = Math.floor(index / maxPairsPerRow);
      const col = index % maxPairsPerRow;
      const xLabel = xStart + col * 2 * cellWidth;
      const xValue = xLabel + cellWidth;
      const yPos = yStartInfo + row * rowHeightInfo;

      // Label cell (gray background)
      doc
        .fillColor('#eeeeee')
        .rect(xLabel, yPos, cellWidth, rowHeightInfo)
        .fillAndStroke();

      doc
        .fillColor('black')
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(`${label}:`, xLabel + 4, yPos + 6, {
          width: cellWidth - 8,
          align: 'left',
        });

      // Value cell (white background)
      doc.rect(xValue, yPos, cellWidth, rowHeightInfo).stroke();
      doc.fillColor('black').font('Helvetica').fontSize(9);

      doc.text(String(value ?? '-'), xValue + 4, yPos + 6, {
        width: cellWidth - 8,
        align: 'left',
        ellipsis: true,
      });
    });

    y =
      yStartInfo +
      Math.ceil(datosRuta.length / maxPairsPerRow) * rowHeightInfo +
      30;

    // Generate Google Maps URL for the optimized route
    let googleMapsUrl = '';
    if (origin && destination) {
      const waypointsStr = waypoints.length > 0 ? waypoints.join('|') : '';
      googleMapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(
        origin
      )}${
        waypointsStr ? `/${encodeURIComponent(waypointsStr)}` : ''
      }/${encodeURIComponent(destination)}`;
    }

    // Add Google Maps link section
    // if (googleMapsUrl) {
    //   doc
    //     .font('Helvetica-Bold')
    //     .fontSize(12)
    //     .fillColor('blue')
    //     .text('Enlace para Abrir Ruta en Google Maps:', xStart, y);

    //   y += 20;

    //   doc
    //     .font('Helvetica')
    //     .fontSize(9)
    //     .fillColor('blue')
    //     .text(googleMapsUrl, xStart, y, {
    //       width: availableWidth,
    //       link: googleMapsUrl,
    //       underline: true,
    //     });

    //   y += 25;

    //   doc
    //     .font('Helvetica-Oblique')
    //     .fontSize(8)
    //     .fillColor('gray')
    //     .text(
    //       'Copie y pegue este enlace en su navegador para abrir la ruta optimizada en Google Maps.',
    //       xStart,
    //       y,
    //       {
    //         width: availableWidth,
    //         align: 'left',
    //       }
    //     );

    //   y += 25;
    // }

    // Add a new page before the image to avoid overlapping or cut-off


    const imageOriginalWidth = 800;
    const imageOriginalHeight = 600;
    const imageAspectRatio = imageOriginalWidth / imageOriginalHeight;
    
    const minBottomMargin = 40; // << raise bottom margin from default
    const imageMaxWidth = availableWidth;
    const imageMaxHeight = doc.page.height - y - minBottomMargin;
    
    // Calculate optimal size with preserved aspect ratio
    let imageWidth = imageMaxWidth;
    let imageHeight = imageWidth / imageAspectRatio;
    
    // If height overflows, scale down
    if (imageHeight > imageMaxHeight) {
      imageHeight = imageMaxHeight;
      imageWidth = imageHeight * imageAspectRatio;
    }
    
    const imageX = xStart + (availableWidth - imageWidth) / 2;
    
    // Draw title
    doc
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('Mapa de Ruta Optimizada', xStart, y, {
        align: 'center',
      });
    
    y += 20;
    
    // Draw image centered
    doc.image(mapImageResponse.data, {
      x: imageX,
      y: y,
      width: imageWidth,
      height: imageHeight,
    });
    
    y += imageHeight + 20; // you can increase this if needed
    

    // New page for appointments table
    doc.addPage();
    y = marginTop;

    // Table headers setup - Adjusted to fit landscape page
    const appointmentHeaders = [
      'N°',
      'DOC',
      'NÚMERO',
      'NOMBRE',
      'APELLIDO',
      'INICIO',
      'FIN',
      'TIPO',
      'EMPRESA',
      'DIRECCIÓN',
      'TELÉFONO',
    ];

    // Calculate column widths to fit available space
    const totalAvailableWidth = availableWidth - 20; // Leave some margin
    const colWidths = [
      25, // N°
      35, // DOC
      60, // NÚMERO
      65, // NOMBRE
      65, // APELLIDO
      70, // INICIO
      70, // FIN
      45, // TIPO
      85, // EMPRESA
      90, // DIRECCIÓN
      65, // TELÉFONO
    ];

    // Section headers - Updated for new column structure
    const secciones = [
      { title: 'Información Aprendiz', count: 5 },
      { title: 'Información Agendamiento', count: 3 },
      { title: 'Información Empresa', count: 3 },
    ];

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

    // Column headers
    const drawColumnHeaders = () => {
      let x = xStart;
      doc.font('Helvetica-Bold').fontSize(8);
      appointmentHeaders.forEach((header, i) => {
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

    // Draw headers
    drawSectionHeaders();
    drawColumnHeaders();

    // Data rows with improved text wrapping
    doc.font('Helvetica').fontSize(7);

    agendamientosResultado.forEach((agendamiento, index) => {
      // Check if we need a new page
      if (y + rowHeight > availableHeight) {
        doc.addPage();
        y = marginTop;
        drawSectionHeaders();
        drawColumnHeaders();
        doc.font('Helvetica').fontSize(7);
      }

      const row = [
        (index + 1).toString(),
        agendamiento.usuarioTipoDocumento || '-',
        agendamiento.usuarioNumeroDocumento?.toString() || '-',
        agendamiento.usuarioNombre || '-',
        agendamiento.usuarioApellido || '-',
        format(new Date(agendamiento.fechaInicio), 'dd/MM HH:mm', {
          locale: es,
        }),
        format(new Date(agendamiento.fechaFin), 'dd/MM HH:mm', { locale: es }),
        agendamiento.tipoVisita || '-',
        agendamiento.empresaRazonSocial || '-',
        agendamiento.empresaDireccion || '-',
        agendamiento.empresaTelefono?.toString() || '-',
      ];

      let x = xStart;
      row.forEach((cell, i) => {
        const width = colWidths[i];
        doc.rect(x, y, width, rowHeight).stroke();

        // Adjust text size for better fit
        const fontSize = width < 50 ? 6 : 7;
        doc.fontSize(fontSize);

        doc.text(String(cell), x + 1, y + 4, {
          width: width - 2,
          align: i === 0 ? 'center' : 'left', // Center align for row number
          ellipsis: true,
          height: rowHeight - 2,
        });
        x += width;
      });

      y += rowHeight;
    });

    // Add summary statistics
    y += 30;
    if (y + 100 > availableHeight) {
      doc.addPage();
      y = marginTop;
    }

    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('Resumen de Agendamientos', xStart, y);

    y += 20;

    // Calculate statistics
    const tiposVisita = agendamientosResultado.reduce((acc, curr) => {
      acc[curr.tipoVisita] = (acc[curr.tipoVisita] || 0) + 1;
      return acc;
    }, {});

    const empresas = [
      ...new Set(agendamientosResultado.map((a) => a.empresaRazonSocial)),
    ];
    const aprendices = [
      ...new Set(
        agendamientosResultado.map(
          (a) => `${a.usuarioNombre} ${a.usuarioApellido}`
        )
      ),
    ];

    const estadisticas = [
      ['Total de Agendamientos', agendamientosResultado.length.toString()],
      ['Empresas Diferentes', empresas.length.toString()],
      ['Aprendices Diferentes', aprendices.length.toString()],
      ['Visitas Presenciales', (tiposVisita['Presencial'] || 0).toString()],
      ['Visitas Virtuales', (tiposVisita['Virtual'] || 0).toString()],
    ];

    // Draw statistics
    const statsCellWidth = availableWidth / 4;
    const statsRowHeight = 25;

    estadisticas.forEach(([label, value], index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const xLabel = xStart + col * 2 * statsCellWidth;
      const xValue = xLabel + statsCellWidth;
      const yPos = y + row * statsRowHeight;

      // Label cell
      doc
        .fillColor('#eeeeee')
        .rect(xLabel, yPos, statsCellWidth, statsRowHeight)
        .fillAndStroke();

      doc
        .fillColor('black')
        .font('Helvetica-Bold')
        .fontSize(9)
        .text(`${label}:`, xLabel + 4, yPos + 8, {
          width: statsCellWidth - 8,
          align: 'left',
        });

      // Value cell
      doc.rect(xValue, yPos, statsCellWidth, statsRowHeight).stroke();
      doc.fillColor('black').font('Helvetica').fontSize(9);

      doc.text(value, xValue + 4, yPos + 8, {
        width: statsCellWidth - 8,
        align: 'center',
      });
    });

    y += Math.ceil(estadisticas.length / 2) * statsRowHeight + 30;

    // Add note at the end with additional information about the Google Maps link
    doc
      .font('Helvetica-Oblique')
      .fontSize(9)
      .fillColor('gray')
      .text(
        `Nota: Este reporte muestra la ruta optimizada para los agendamientos del instructor en la fecha seleccionada. La ruta está optimizada para minimizar tiempo y distancia de viaje. Las visitas virtuales no requieren desplazamiento físico pero se incluyen en el reporte para completitud de la información. Para navegar en tiempo real, utilice el enlace de Google Maps proporcionado arriba.`,
        xStart,
        y,
        {
          width: availableWidth,
          align: 'justify',
        }
      );

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error('Error generating maps report:', error);
    return ApiResponse.error(
      res,
      error,
      error.message || 'Error al generar el reporte de rutas y agendamientos.'
    );
  }
};
