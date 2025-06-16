import archiver from 'archiver';
import fs from 'fs';
import { generarZipDocumentosFichaAprendices } from './generarZipDocumentosFichaAprendices.js';
import ApiResponse from '../../../utils/apiResponse.js';
import { eliminarCarpeta } from '../../../utils/fileHelpers.js';

export const downloadDocumentosFicha = async (req, res) => {
  try {
    // downloadDocumentosFicha.js
    const resultado = await generarZipDocumentosFichaAprendices(req, res);
    if (!resultado) {
      return ApiResponse.badRequest(
        res,
        'No se encontraron aprendices para la ficha.'
      );
    }

    const { filesAprendices, pathFicha, nameFicha } = resultado;

    const zipFilePath = `${pathFicha}.zip`;
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);
    archive.directory(pathFicha, false);

    await archive.finalize();

    output.on('close', () => {
      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${nameFicha}.zip"`,
        'Content-Length': archive.pointer(),
      });

      const fileStream = fs.createReadStream(zipFilePath);
      fileStream.pipe(res);

      fileStream.on('end', async () => {
        fs.unlink(zipFilePath, (err) => {
          if (err) console.error('Error eliminando el archivo ZIP:', err);
        });
        await eliminarCarpeta(pathFicha);
      });
    });
  } catch (error) {
    console.error('Error al generar y enviar el ZIP:', error);
    return ApiResponse.error(res, error, 'Error al generar el ZIP.');
  }
};
