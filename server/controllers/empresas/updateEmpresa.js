import models from '../../models/index.js';
const { Empresa } = models;
import ApiResponse from '../../utils/apiResponse.js';

//Modificar la empresa por ID
export const updateEmpresa = async (req, res) => {
  const { idEmpresa } = req.params;
  const nuevosDatos = req.body;

  // Validación de id_empresa
  if (!idEmpresa) {
    return ApiResponse.badRequest(res, 'El id_empresa es requerido.');
  }

  try {
    if (req.body.correoElectronico) {
      req.body.correoElectronico = req.body.correoElectronico.toLowerCase();
    }
    
    const [updateRow] = await Empresa.update(nuevosDatos, {
      where: {
        idEmpresa,
      },
    });

    // Verificar si se actualizó algún registro
    if (updateRow === 0) {
      return ApiResponse.notFound(res, 'Empresa no encontrada.');
    }

    // Obentenemos la empresa actualizada
    const empresaActualizada = await Empresa.findByPk(idEmpresa);

    return ApiResponse.success(
      res,
      empresaActualizada,
      'Empresa actualizada exitosamente.'
    );
  } catch (error) {
    console.error(
      'Error en la actualización de los datos de la empresa:',
      error
    );
    return ApiResponse.error(
      res,
      error,
      'Error en la actualizacion de los datos de la empresa.'
    );
  }
};
