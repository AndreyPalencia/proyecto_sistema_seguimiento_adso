import models from '../../models/index.js';
const { Usuario } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { Op } from 'sequelize';

// Obtener usuarios -> Agregar clasulas para rol instructro para no buscar en fichas no le corresponda
export const getUsuarios = async (req, res) => {
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
      filtros.estadoUsuario = estadoUsuario;
    }

    if (numeroDocumento) {
      filtros.numeroDocumento = numeroDocumento;
    }

    if (nombre) {
      filtros.nombre = { [Op.like]: `%${nombre}%` };
    }

    if (apellido) {
      filtros.apellido = { [Op.like]: `%${apellido}%` };
    }

    if (correoElectronico) {
      filtros.correoElectronico = correoElectronico;
    }

    // Validar si no se pasaron filtros
    if (Object.keys(filtros).length === 0) {
      return ApiResponse.validation(
        res,
        { mensaje: 'No se proporcionaron parámetros de búsqueda.' },
        'Error de validación'
      );
    }

    const usuarios = await Usuario.findAll({ where: filtros });

    if (usuarios.length === 0) {
      return ApiResponse.notFound(res, 'No se encontro Usuarios relacionados');
    }

    return ApiResponse.success(
      res,
      usuarios,
      'Usuarios encontrados exitosamente.'
    );
  } catch (error) {
    console.error('Error en obtener los usuarios', error);
    return ApiResponse.error(res, error, 'Error en obtener los usuariso');
  }
};
