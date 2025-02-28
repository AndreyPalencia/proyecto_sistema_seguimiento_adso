import models from '../models/index.js';
const { Usuario } = models;
import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/apiResponse.js';
import encryptionUtil from '../utils/encryptionUtil.js';
const { SECRET_JWT_KEY } = process.env;

export const loginUser = async (req, res) => {
  const { password, numeroDocumento, tipoDocumento } = req.body;

  try {
    const usuarioEncontrado = await Usuario.findOne({
      where: {
        numeroDocumento,
        tipoDocumento,
      },
    });

    if (!usuarioEncontrado) {
      return ApiResponse.badRequest(
        res,
        'El usuario o contraseña es incorrecta..'
      );
    }

    const verifyPassword = await encryptionUtil.comparePassword(
      password,
      usuarioEncontrado.password
    );

    if (!verifyPassword) {
      return ApiResponse.badRequest(
        res,
        'El usuario o contraseña es incorrecta...'
      );
    }

    const token = jwt.sign(
      {
        idUsuario: usuarioEncontrado.idUsuario,
        tipoDocumento: usuarioEncontrado.tipoDocumento,
        numeroDocumento: usuarioEncontrado.numeroDocumento,
        rol: usuarioEncontrado.rol,
        estadoUsuario: usuarioEncontrado.estadoUsuario,
      },
      SECRET_JWT_KEY,
      { expiresIn: '1h' }
    );

    return res
      .cookie('acceso_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', //None
        maxAge: 1000 * 60 * 60,
      })
      .status(200)
      .send({ success: true, message: 'Inicio de sesion Autorizado.' });
  } catch (error) {
    console.error('Error en el inicio de sesión ', error);
    return ApiResponse.error(res, error, 'Error en el inicio de sesión');
  }
};
