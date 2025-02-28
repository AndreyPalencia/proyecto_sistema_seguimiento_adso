import ApiResponse from '../utils/apiResponse.js';

export const validateAuth = async (req, res, next) => {
  const { password, numeroDocumento, tipoDocumento } = req.body;

  const documentos = ['CC', 'CE', 'TI', 'PEP', 'PPT'];

  if (!password || password.length < 8) {
    return ApiResponse.badRequest(res, 'Información de Usuario invalida.');
  }

  if (!numeroDocumento || !/^[1-9]\d*$/.test(numeroDocumento)) {
    return ApiResponse.badRequest(res, 'Información de Usuario invalida.');
  }

  if (
    !tipoDocumento ||
    !documentos.includes(tipoDocumento.trim().toUpperCase())
  ) {
    return ApiResponse.badRequest(res, 'Tipo de documento inválido.');
  }
  next();
};
