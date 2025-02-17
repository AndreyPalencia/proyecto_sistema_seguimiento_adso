/**
 * Clase para estandarizar las respuestas de la API
 */

class ApiResponse {
  /**
   * Respuesta exitosa genérica
   * @param {Response} res - Objeto de respuesta de Express
   * @param {*} data - Datos a enviar
   * @param {string} message - Mensaje de éxito
   * @param {number} statusCode - Código HTTP
   */
  static success(
    res,
    data = null,
    message = 'Operación exitos',
    statusCode = 200
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Respuesta de error
   * @param {Response} res - Objeto de respuesta de Express
   * @param {Error} error - Objeto de error
   * @param {string} message - Mensaje de error
   * @param {number} statusCode - Código HTTP
   */
  static error(
    res,
    error = null,
    message = 'Error en la operación',
    statusCode = 500
  ) {
    const errorMessage = error?.message || message;

    const errorResponse = {
      success: false,
      message: errorMessage,
    };

    //En desarrollo se envía el stack y el error completo
    if (process.env.NODE_ENV === 'development') {
      errorResponse.error = {
        stack: error?.stack,
        details: error,
      };
    }

    return res.status(statusCode).json(errorResponse);
  }

  /**
   * Respuesta para recursos creados
   * @param {Response} res - Objeto de respuesta de Express
   * @param {*} data - Datos del recurso creado
   * @param {string} message - Mensaje de éxito
   */
  static created(res, data = null, message = 'Recurso creado exitosamente') {
    return this.success(res, data, message, 201);
  }

  /**
   * Respuesta para errores de validación
   * @param {Response} res - Objeto de respuesta de Express
   * @param {Object} errors - Objeto con errores de validación
   * @param {string} message - Mensaje de error
   */
  static validation(res, errors, message = 'Error de validación') {
    return res.status(422).json({
      success: false,
      message,
      errors,
    });
  }

  /**
   * Respuesta para recurso no encontrado
   * @param {Response} res - Objeto de respuesta de Express
   * @param {string} message - Mensaje de error
   */
  static notFound(res, message = 'Recurso no encontrado') {
    return this.error(res, null, message, 404);
  }

  /**
   * Respuesta para error de autorización
   * @param {Response} res - Objeto de respuesta de Express
   * @param {string} message - Mensaje de error
   */
  static unauthorized(res, message = 'No autorizado') {
    return this.error(res, null, message, 401);
  }

  /**
   * Respuesta para error de solicitud incorrecta
   * @param {Response} res - Objeto de respuesta de Express
   * @param {string} message - Mensaje de error
   */
  static badRequest(res, message = 'Solicitud incorrecta') {
    return this.error(res, null, message, 400);
  }
}

export default ApiResponse;