import models from '../../models/index.js';
const { Usuario } = models;
import ApiResponse from '../../utils/apiResponse.js';
// ✅ Correct
import { Op, where, cast, col } from 'sequelize';

// Obtener usuarios -> Agregar clasulas para rol instructro para no buscar en fichas no le corresponda
export const searchUsuarios = async (req, res) => {
  const {
    estadoUsuario,
    numeroDocumento,
    nombre,
    apellido,
    correoElectronico,
  } = req.body;

  try {
    //Definen el objeto de filtros
    const filtros = {};

    if (estadoUsuario !== undefined) {
      filtros.estadoUsuario = parseInt(estadoUsuario);
    }

    if (nombre) {
      filtros.nombre = { [Op.like]: `%${nombre}%` };
    }

    if (apellido) {
      filtros.apellido = { [Op.like]: `%${apellido}%` };
    }

    if (correoElectronico) {
      filtros.correoElectronico = { [Op.like]: `%${correoElectronico}%` };
    }

    const condiciones = [];

    if (numeroDocumento) {
      condiciones.push(
        where(cast(col('numero_documento'), 'TEXT'), {
          [Op.like]: `${numeroDocumento}%`,
        })
      );
    }

    if (Object.keys(filtros).length === 0 && condiciones.length === 0) {
      return ApiResponse.validation(
        res,
        'No se proporcionaron parámetros de búsqueda.'
      );
    }

    const usuarios = await Usuario.findAll({
      where: {
        ...filtros,
        ...(condiciones.length > 0 ? { [Op.and]: condiciones } : {}),
      },
    });

    if (usuarios.length === 0) {
      return ApiResponse.success(
        res,
        [],
        'No se encontro Usuarios relacionados.'
      );
    }

    return ApiResponse.success(
      res,
      usuarios,
      'Usuarios encontrados exitosamente.'
    );
  } catch (error) {
    console.error('Error en obtener los usuarios:', error);
    return ApiResponse.error(res, error, 'Error en obtener los usuariso.');
  }
};
