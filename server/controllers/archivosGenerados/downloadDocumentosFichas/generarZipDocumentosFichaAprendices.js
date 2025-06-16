import path from 'path';
import models from '../../../models/index.js';
const { FichaAprendiz, Ficha, Usuario, Bitacora, Documento, ReporteGFPIF } =
  models;
import ApiResponse from '../../../utils/apiResponse.js';
import {
  BASE_UPLOAD_PATH,
  createFolderAprendiz,
  filesDocumentosBitacorasAprendices,
} from '../../../utils/fileHelpers.js';
import { generarFilesReportesGFPIF } from '../../../utils/reportesGFPIFHelpers.js';
import { mkdir } from 'fs/promises';

export const generarZipDocumentosFichaAprendices = async (req, res) => {
  let pathFicha;
  try {
    const { idFicha } = req.params;

    //Info aprendices: Bitacoras, documentos y reportes de los aprendices
    const datosAprendices = await FichaAprendiz.findAll({
      where: { idFicha },
      attributes: ['idFichaAprendiz'],
      include: [
        {
          model: Usuario,
          attributes: [
            'idUsuario',
            'nombre',
            'apellido',
            'tipoDocumento',
            'numeroDocumento',
          ],
        },
        {
          model: Bitacora,
          attributes: {
            exclude: [
              'idFichaAprendiz',
              'observacion',
              'estadoBitacora',
              'idBitacora',
            ],
          },
        },
        {
          model: Documento,
          attributes: {
            exclude: [
              'idFichaAprendiz',
              'observacion',
              'estadoDocumento',
              'idDocumento',
            ],
          },
        },
        {
          model: ReporteGFPIF,
          attributes: ['idReporte'],
        },
      ],
    });

    if (!datosAprendices || datosAprendices.length == 0) {
      return null
    }

    //Info ficha
    const infoFicha = await Ficha.findByPk(idFicha);

    //Nombre carpeta ficha
    const nameFicha =
      `FICHA_${infoFicha.numeroFicha}_${infoFicha.nombrePrograma}`
        .toUpperCase()
        .replace(/\s+/g, '_');

    //pathFicha
    pathFicha = path.join(BASE_UPLOAD_PATH, nameFicha);
    //Carpeta
    await mkdir(pathFicha, { recursive: true });

    const filesAprendices = await Promise.all(
      datosAprendices.map(async (apr) => {
        const { idFichaAprendiz, Usuario, Bitacoras, Documentos, Reportes } =
          apr;
        const pathAprendiz = await createFolderAprendiz(pathFicha, Usuario);
        const resultadosBitacorasDocumentos =
          await filesDocumentosBitacorasAprendices(
            pathAprendiz,
            Bitacoras,
            Documentos
          );
        const resultadoReportes = await generarFilesReportesGFPIF(
          pathAprendiz,
          idFicha,
          idFichaAprendiz,
          Reportes
        );
        return {
          usuario:
            Usuario?.nombreCompleto || Usuario?.correo || Usuario?.idUsuario,
          reportes: {
            success: resultadoReportes.success,
            errores: resultadoReportes.errores || [],
            message: resultadoReportes.message,
          },
          resultadosBitacorasDocumentos,
        };
      })
    );

    return { filesAprendices, pathFicha, nameFicha };
  } catch (error) {
    console.error('Error al crear la carpeta de descarga:', error);
    await eliminarCarpeta(pathFicha);
    return ApiResponse.error(
      res,
      error,
      'Error al crear la carpeta de descarga.'
    );
  }
};
