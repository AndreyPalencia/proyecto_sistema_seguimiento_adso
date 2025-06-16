import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/apiResponse.js';
const { SECRET_JWT_KEY } = process.env;

export const perfilUser = (req, res) => {
  try {
    const token = req.cookies.acceso_token;
    if (!token) {
      return ApiResponse.unauthorized(res, 'Acceso denegado. No hay token.');
    }

    const usuarioDecoded = jwt.verify(token, SECRET_JWT_KEY);

    const usuario = {
      rol: usuarioDecoded.rol,
      idUsuario: usuarioDecoded.idUsuario,
    };

    //console.log(token,rol)
    return ApiResponse.success(res, usuario, 'Usuario verificado.');
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: 'Token inválido o expirado.' });
  }
};
