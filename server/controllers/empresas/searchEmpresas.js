import models from '../../models/index.js';
const { Empresa } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { Op } from 'sequelize';

export const searchEmpresas = async (req, res) => {
  const { nit, razonSocial, idEmpresa } = req.body;

  const condiciones = [];
  // Extrae solo la parte numérica del NIT, considerando también el dígito de verificación
  const nitClean = nit.match(/^(\d+)-?(\d*)/)?.[1]; // The first part of NIT (before or after '-')
  const digit = nit.match(/^(\d+)-?(\d*)/)?.[2]; // The second part (digit after '-')

  if (nitClean) {
    // If a valid NIT number was found, add the condition for the NIT
    condiciones.push({
      nit: {
        [Op.like]: `%${nitClean}%`,
      },
    });

    // If a verification digit was found, validate it and add the condition
    if (digit) {
      condiciones.push({
        nit: {
          [Op.like]: `%-${digit}%`,
        },
      });
    }
  }

  if (razonSocial) {
    condiciones.push({
      razonSocial: {
        [Op.like]: `%${razonSocial}%`,
      },
    });
  }

  if (idEmpresa) {
    condiciones.push({
      idEmpresa: {
        [Op.not]: idEmpresa,
      },
    });
  }

  const where = condiciones.length ? { [Op.and]: condiciones } : {};

  try {
    const empresas = await Empresa.findAll({ where });

    if (!empresas.length) {
      return ApiResponse.success(
        res,
        false,
        'No se encontraron empresas relacionadas.'
      );
    }

    const mensaje =
      empresas.length > 1 ? 'Empresas encontradas.' : 'Empresa encontrada.';

    return ApiResponse.success(res, empresas, mensaje);
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    return ApiResponse.error(res, error, 'Error en la obtención de empresas.');
  }
};
