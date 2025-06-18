import models from '../../models/index.js';
const { ReporteGFPIF, FichaAprendiz, Ficha, Usuario } = models;
import ApiResponse from '../../utils/apiResponse.js';
import {
  generarRutaReporteJSON,
  guardarReporteArchivoJSON,
} from '../../utils/reportesGFPIFHelpers.js';
import { deleteFileSafely } from '../../utils/fileHelpers.js';

// Crear un reporte en JSON
export const createReporteGFPIF = async (req, res) => {
  const { idFichaAprendiz } = req.params;
  const { datosReporteJSON, ...restoDatos } = req.body;


  console.log(datosReporteJSON, restoDatos)

  //Validamos los datos reporteJSON y idFichaAprendiz
  if (!datosReporteJSON) {
    return ApiResponse.badRequest(
      res,
      'No se proporcionaron datos para el reporte: Datos de reporte faltantes'
    );
  }

  let rutaReporteJSON;

  try {
    //Obtenemos de FichaAprendiz la propiedad de idUsuario de idFichaAprendiz
    const fichaAprendiz = await FichaAprendiz.findByPk(idFichaAprendiz, {
      attributes: ['idUsuario', 'idFicha'],
      // include: [
      //   {
      //     model: Ficha,
      //     attributes: ['idInstructor'],
      //   },
      // ],
    });

    ///Obtemos el idAprendiz de la tablal FichaAprendiz desde la propiedad idUsuario
    const idAprendiz = fichaAprendiz?.idUsuario || null;
    const idFicha = fichaAprendiz?.idFicha || null;
    //const idInstructor = fichaAprendiz?.Ficha?.idInstructor || null;

    //Obtenemos el numero de la Ficha del aprendiz y los datos de instructor
    // const ficha = await Ficha.findByPk(idFicha, {
    //   attributes: ['numeroFicha'],
    //   include: [
    //     {
    //       model: Usuario,
    //       attributes: ['idUsuario', 'nombre', 'apellido', 'telefono', 'correoElectronico']
    //     }
    //   ]
    // });

    //Generamos la propiedad de informacion del intructor
    // const infoInstructor = {
    //   nombreInstructor:
    //     `${ficha?.Usuario?.nombre} ${ficha?.Usuario?.apellido}` ||
    //     'No disponible',
    //   telefono: ficha?.Usuario?.telefono || 'No disponible',
    //   correoElectronico: ficha?.Usuario?.correoElectronico || 'No disponible',
    // };

    //Agregamos al datosReporteJSON los ids de idInstructor, idsAprendiz y el id ficha
    //datosReporteJSON.idInstructor = idInstructor;
    datosReporteJSON.idAprendiz = idAprendiz;
    datosReporteJSON.idFicha = idFicha;

    //Generar la ruta del reporte y su nombre para la base de datos
    const { ubicacionReporte, nombreReporte } = generarRutaReporteJSON(
      idAprendiz,
      idFicha
    );

    rutaReporteJSON = ubicacionReporte;

    //Guardar el reporte en un archivo JSON
    guardarReporteArchivoJSON(rutaReporteJSON, datosReporteJSON);

    //Guardar los datos en la base de datos
    const reporteDatosModelo = {
      nombreReporte,
      idFichaAprendiz,
      ...restoDatos,
    };

    //Crea el reporte
    const reporteCreado = await ReporteGFPIF.create(reporteDatosModelo);

    //Enviar respuesta exitosa con el JSON generado
    return ApiResponse.success(
      res,
      reporteCreado,
      'Reporte JSON generado exitosamente.'
    );
  } catch (error) {
    if (rutaReporteJSON) {
      deleteFileSafely(rutaReporteJSON);
    }
    console.error('Error en crear el reporte:', error);
    return ApiResponse.error(res, error, 'Error al generar el reporte JSON.');
  }
};
