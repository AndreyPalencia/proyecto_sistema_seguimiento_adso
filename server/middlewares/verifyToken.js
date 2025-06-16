import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/apiResponse.js';

const { SECRET_JWT_KEY } = process.env;

/**
 * Middleware to verify JWT from cookies.
 * @param {string[]} allowedRoles - optional list of allowed roles (use ['*'] for any authenticated role)
 */
const verifyToken = (allowedRoles = []) => {
  return (req, res, next) => {
    const token = req.cookies.acceso_token || req.body.token || req.query.token;
    if (!token) {
      return ApiResponse.unauthorized(res, 'Token expirado');
    }

    try {
      const decoded = jwt.verify(token, SECRET_JWT_KEY);
      req.user = decoded;

      const isAllowed =
        allowedRoles.includes('*') || allowedRoles.includes(decoded.rol);

      if (allowedRoles.length > 0 && !isAllowed) {
        return ApiResponse.unauthorized(
          res,
          'Acceso denegado: Rol no permitido'
        );
      }
      next();
    } catch (error) {
      return ApiResponse.unauthorized(res, 'Token invalido');
    }
  };
};

export default verifyToken;
