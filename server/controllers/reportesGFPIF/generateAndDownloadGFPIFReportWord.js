import ApiResponse from '../../utils/apiResponse.js';
import { generateGFPIFReportWord } from './generateGFPIFReportWord.js';

export const generateAndDownloadGFPIFReportWord = async (req, res) => {
  try {
    // Generate the Word report and get buffer + filename
    const { bufferDocumentoWord, nombreReporteFormatoDOCX } =
      await generateGFPIFReportWord(req, res);

    // Set headers for download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(
        nombreReporteFormatoDOCX
      )}`
    );

    // Send file buffer as response
    return res.status(200).send(bufferDocumentoWord);
  } catch (error) {
    console.error('Error en la descarga del reporte Word:', error);
    return ApiResponse.error(
      res,
      error,
      'Error al generar la descarga del reporte Word'
    );
  }
};
