import models from '../../models/index.js';
import ExcelJS from 'exceljs';
import ApiResponse from '../../utils/apiResponse.js';
import encryptionUtil, {
  generateSecurePassword,
} from '../../utils/encryptionUtil.js';
import { sendWelcomeEmailToSAEP } from '../../services/mailerService.js';
import { deleteFileSafely } from '../../utils/fileHelpers.js';
import sequelize from '../../config/base_datos.js';

const { Usuario, Empresa, FichaAprendiz, Ficha } = models;

export const createAprendicesFichasByExcel = async (req, res) => {
  const archivo = req.file;
  const idFichaParam = req.params.idFicha;

  if (!archivo) {
    return ApiResponse.badRequest(res, 'No se ha subido ningún archivo.');
  }

  try {
    const ficha = await Ficha.findOne({
      where: { idFicha: idFichaParam },
      attributes: ['idFicha'],
    });

    if (!ficha) {
      return ApiResponse.notFound(res, 'Ficha no encontrada.');
    }

    const idFicha = ficha.idFicha;

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(archivo.path);
    const worksheet = workbook.worksheets[0];

    const filas = [];
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return;
      filas.push(row.values.slice(1));
    });

    const resultados = [];
    const t = await sequelize.transaction();

    try {
      for (const fila of filas) {
        console.log('Procesando fila:', fila);

        const [
          _omitido,
          tipoDocumento,
          numeroDocumento,
          nombre,
          apellido,
          telefono,
          rawCorreoElectronico,
          nit,
          razonSocial,
          direccion,
          telefonoEmpresa,
          correoEmpresa,
          jefeInmediato,
          cargoJefe,
          modalidad,
          cargoEmpresa,
          rawCorreoJefe,
          telefonoJefe,
        ] = fila;

        const correoElectronico = extractText(rawCorreoElectronico);
        const correoJefe = extractText(rawCorreoJefe);

        let correoEnviado = false;

        try {
          // Verificar si el usuario ya existe por documento o correo
          const usuarioPorDoc = await Usuario.findOne({
            where: { numeroDocumento },
            transaction: t,
          });

          const usuarioPorCorreo = await Usuario.findOne({
            where: { correoElectronico },
            transaction: t,
          });

          let usuario;

          if (
            usuarioPorDoc &&
            usuarioPorCorreo &&
            usuarioPorDoc.idUsuario !== usuarioPorCorreo.idUsuario
          ) {
            throw new Error(
              'Documento y correo pertenecen a distintos usuarios.'
            );
          }

          if (
            usuarioPorDoc &&
            usuarioPorDoc.correoElectronico !== correoElectronico
          ) {
            throw new Error(
              'Correo diferente ya registrado con ese documento.'
            );
          }

          if (usuarioPorCorreo && !usuarioPorDoc) {
            throw new Error(
              'Correo electrónico ya registrado con otro documento.'
            );
          }

          const password = generateSecurePassword();
          const passwordEncriptada = await encryptionUtil.hashPassword(
            password
          );

          const tipoDocumentoLimpio = normalizeTipoDocumento(tipoDocumento);

          usuario =
            usuarioPorDoc ||
            (await Usuario.create(
              {
                tipoDocumento: tipoDocumentoLimpio,
                numeroDocumento,
                nombre,
                apellido,
                telefono,
                correoElectronico: correoElectronico.toLowerCase(),
                password: passwordEncriptada,
                estadoUsuario: 1,
                rol: 'aprendiz',
              },
              { transaction: t }
            ));

          // Enviar correo de bienvenida (intento seguro)
          if (!usuarioPorDoc) {
            try {
              await sendWelcomeEmailToSAEP(usuario, password);
              correoEnviado = true;
            } catch (correoError) {
              console.error(
                `No se pudo enviar correo a ${correoElectronico}:`,
                correoError.message
              );
              correoEnviado = false;
            }
          }

          // Verificar o crear empresa
          let empresa = await Empresa.findOne({
            where: { nit },
            transaction: t,
          });

          if (!empresa) {
            empresa = await Empresa.create(
              {
                nit,
                razonSocial,
                direccion,
                telefono: telefonoEmpresa,
                correoElectronico: correoEmpresa,
              },
              { transaction: t }
            );
          }

          // Crear ficha aprendiz
          await FichaAprendiz.create(
            {
              idUsuario: usuario.idUsuario,
              idEmpresa: empresa.idEmpresa,
              idFicha: idFicha,
              alternativa: modalidad,
              cargoEmpresa,
              jefeInmediato,
              telefonoJefe,
              correoElectronicoJefe: correoJefe,
              cargoJefe,
            },
            { transaction: t }
          );

          resultados.push({
            nombreCompleto: `${nombre} ${apellido}`,
            numeroDocumento,
            correoElectronico,
            empresa: razonSocial,
            nitEmpresa: nit,
            estado: 'creado',
            correoEnviado,
          });
        } catch (errorInterno) {
          resultados.push({
            nombreCompleto: `${nombre ?? ''} ${apellido ?? ''}`.trim(),
            numeroDocumento: numeroDocumento ?? '',
            correoElectronico: correoElectronico ?? '',
            empresa: razonSocial ?? '',
            nitEmpresa: nit ?? '',
            estado: 'rechazado',
            motivo: errorInterno.message,
            correoEnviado: false,
          });
        }
      }

      await t.commit();
      return ApiResponse.success(res, resultados, 'Importación finalizada.');
    } catch (errorInterno) {
      await t.rollback();
      console.error('Error durante transacción:', errorInterno);
      return ApiResponse.error(
        res,
        errorInterno,
        'Error durante la importación.'
      );
    }
  } catch (error) {
    console.error('Error general al procesar el archivo:', error);
    return ApiResponse.error(res, error, 'No se pudo procesar el archivo.');
  } finally {
    if (req.file?.path) {
      await deleteFileSafely(req.file.path);
    }
  }
};

function extractText(value) {
  if (typeof value === 'object' && value?.text) return value.text;
  return value;
}

function normalizeTipoDocumento(valorCrudo) {
  if (!valorCrudo || typeof valorCrudo !== 'string') return null;

  const texto = valorCrudo.trim().toUpperCase();

  const mapa = {
    CC: [
      'CEDULA DE CIUDADANIA',
      'CEDULA CIUDADANA',
      'CEDULA CUIDADANA',
      'CEDULA',
    ],
    TI: ['TARJETA DE IDENTIDAD', 'TI'],
    CE: ['CEDULA DE EXTRANJERIA', 'CEDULA EXTRANJERA', 'CE'],
    PAS: ['PASAPORTE', 'PAS'],
    RC: ['REGISTRO CIVIL', 'RC'],
  };

  for (const [codigo, variantes] of Object.entries(mapa)) {
    if (variantes.some((v) => texto.includes(v))) {
      return codigo;
    }
  }

  return texto.length <= 3 ? texto : null; // Devuelve abreviaciones desconocidas o null
}
