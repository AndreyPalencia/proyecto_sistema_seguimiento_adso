import ApiResponse from '../../utils/apiResponse.js';
import { generateGFPIFReportWord } from './generateGFPIFReportWord.js';

export const generateAndDownloadGFPIFReportWord = async (req, res) => {
  try {
    //Generar el reporte en formato Word por medio de un buffer
    const { bufferDocumentoWord, nombreReporteFormatoDOCX } =
      await generateGFPIFReportWord(req, res);

    // Configurar encabezados para la descarga
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${nombreReporteFormatoDOCX}"`
    );

    // Enviar el archivo como respuesta
    return res.send(bufferDocumentoWord);
  } catch (error) {
    console.error('Error en la descarga del reporte Word:', error);
    return ApiResponse.error(
      res,
      error,
      'Error al generar la descarga del reporte Word'
    );
  }
};
