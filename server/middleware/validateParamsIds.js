import ApiResponse from '../utils/apiResponse.js';

export const validateParamsIds = async (req, res, next) => {
  try {
    for (const [paramName, value] of Object.entries(req.params)) {
      const numberValue = Number(value);

      if (!value || Number.isNaN(numberValue) || numberValue <= 0) {
        return ApiResponse.badRequest(
          res,
          `El parámetro '${paramName}' es requerido y debe ser un número entero positivo válido.`
        );
      }
    }
    next();
  } catch (error) {
    return ApiResponse.error(
      res,
      error,
      'Error al intentar validar los parámetros.'
    );
  }
};
