import ApiResponse from '../../utils/apiResponse.js';
import { getFileByName } from '../../utils/fileHelpers.js';

export const downloadDocumento = async (req, res) => {
  const { fileName } = req.params;
  try {
    const filePath = await getFileByName('documentos', fileName);
    console.log(filePath);
    res.download(filePath);
  } catch (error) {
    console.error('Error en la descarga:', error.message);
    ApiResponse.error(res, error, 'Error en la descarga de la bitacora');
  }
};
