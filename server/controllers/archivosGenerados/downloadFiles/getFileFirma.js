import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import ApiResponse from '../../../utils/apiResponse.js';

export const getFileFirma = (req, res) => {
  const nombre = req.params.nombre;

  if (!nombre) {
    return ApiResponse.badRequest(res, 'Nombre del archivo requerido.');
  }

  const ruta = path.join(process.cwd(), 'upload/firmas', nombre);

  if (!fs.existsSync(ruta)) {
    return ApiResponse.notFound(res, 'Archivo no encontrado.');
  }

  const mimeType = mime.lookup(nombre) || 'application/octet-stream';
  res.setHeader('Content-Type', mimeType);

  return res.sendFile(ruta, (err) => {
    if (err) {
      return ApiResponse.error(res, err, 'Error al enviar el archivo.');
    }
  });
};
