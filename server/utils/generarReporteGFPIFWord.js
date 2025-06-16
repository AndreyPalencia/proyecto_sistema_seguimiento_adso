import models from '../models/index.js';
const { ReporteGFPIF, FichaAprendiz, Ficha, Usuario, Empresa } = models;
import {
  BASE_UPLOAD_PATH,
  generateFileNameWithExtension,
  getFirmaPath,
} from './fileHelpers.js';
import {
  obtenerRutaArchivoReporteJSON,
  parsearArchivoReporteJSON,
} from './reportesGFPIFHelpers.js';

//Importaciones para la lectura, direccion y ruta de los archvios
import fs from 'fs';
import path from 'path';

//PizZip caraga el archivo docx/pptx/xlsx en memoria
import PizZip from 'pizzip';
//Docxtempleter para generar el documento
import Docxtemplater from 'docxtemplater';
//ImageModule para la insercion de imagenes en documento
import ImageModule from 'docxtemplater-image-module-free';

//Direcion de la imagen transparante por default.
const imgTransparante = path.join(
  BASE_UPLOAD_PATH,
  '..',
  'templates/img_transparente.png'
);

//Ruta de la plantilla de Word
const templatePath = path.join(
  BASE_UPLOAD_PATH,
  '..',
  'templates/PlantillaGFPI_F_023.docx'
);

//Configuración del módulo de imágenes
const imageOpts = {
  /**
   * Esta funcion obtine el tagValue de las etiquetas {%tagName} donde despues con
   * fs.readFileSync(tagValue) se obtine la imagen de los archivos para remplazarla
   */
  getImage: (tagValue) => {
    //En el caso de que no exista o la firma se rempñazo por un imagen transparante
    if (!tagValue) {
      return fs.readFileSync(imgTransparante);
    }
    return fs.readFileSync(tagValue);
  },
  getSize: () => {
    //Tamaño de la imagen en puntos (width, height)
    return [100, 100]; //Ajusta según sea necesario
  },
};

export const generarReporteGFPIFWord = async (
  idFicha,
  idFichaAprendiz,
  idReporte
) => {
  try {
    /**
     * Obtecion de datos
     */
    //Obtenemos la firma de instructor a partir de subconsulta de Reporte a FichaAprendiz
    // a Ficha a Usuario

    //Obtener la información del usuario (incluyendo la firma)
    const infoEmpresUsuario = await FichaAprendiz.findOne({
      where: { idFichaAprendiz },
      attributes: [
        'cargoEmpresa',
        'jefeInmediato',
        'correoElectronicoJefe',
        'telefonoJefe',
        'cargoJefe',
        'alternativa',
      ],
      include: [
        {
          model: Usuario,
          attributes: [
            'idUsuario',
            'firma',
            'nombre',
            'apellido',
            'numeroDocumento',
            'correoElectronico',
            'telefono',
          ],
        },
        {
          model: Empresa,
          attributes: ['razonSocial', 'nit', 'direccion'],
        },

        {
          model: Ficha, //Relación con Ficha
          as: 'Ficha', //Alias de la relación Ficha -> FichaAprendiz
          include: [
            {
              model: Usuario, //Relación con Usuario (Instructor)
              as: 'Usuario', //Alias de la relación entre Ficha y Usuario
              attributes: ['idUsuario', 'nombre', 'apellido', 'firma'],
            },
          ],
        },
      ],
    });

    const instructor = infoEmpresUsuario?.Ficha?.Usuario;

    if (!instructor) {
      return { error: 'Instructor no encontrado.' };
    }

    const usuarioAprendiz = infoEmpresUsuario?.Usuario;
    const empresa = infoEmpresUsuario?.Empresa; // Información de la empresa como entidad
    const relacionEmpresaAprendiz = (({
      cargoEmpresa,
      jefeInmediato,
      correoElectronicoJefe,
      telefonoJefe,
      cargoJefe,
      alternativa,
    }) => ({
      cargoEmpresa,
      jefeInmediato,
      correoElectronicoJefe,
      telefonoJefe,
      cargoJefe,
      alternativa,
    }))(infoEmpresUsuario);

    //Obtenemos la información del numero de la ficha
    const ficha = await Ficha.findByPk(idFicha, {
      attributes: ['numeroFicha', 'nombrePrograma'],
    });

    if (!ficha) {
      return { error: 'Ficha no encontrada.' };
    }

    //Obtenemos el nombre del reporte apartir del idReporte
    const reporteInfo = await ReporteGFPIF.findOne({
      where: { idReporte },
      attributes: ['nombreReporte'],
    });

    if (!reporteInfo) {
      return { error: 'Reporte no encontrado.' };
    }

    //Ruta del archivo JSON existente para traerlo
    const rutaArchivoReporteJSON = obtenerRutaArchivoReporteJSON(
      idFicha,
      reporteInfo.nombreReporte
    );

    if (!fs.existsSync(rutaArchivoReporteJSON)) {
      return { error: 'Archivo JSON no encontrado.' };
    }
    /**
     * Lectura y configuración para generar el documento
     */

    //Leer y parsear el JSON
    const reporteJSON = parsearArchivoReporteJSON(rutaArchivoReporteJSON);

    if (!reporteJSON || typeof reporteJSON !== 'object') {
      return { error: 'El archivo JSON no es válido.' };
    }

    //Leer la plantilla con archivo binario
    const templateFile = fs.readFileSync(templatePath, 'binary');

    //Desconprimimos el archivo con pizzip
    const zip = new PizZip(templateFile);

    //Pasar el archivo desconprimido a docxtemplater
    //Primer argumento es el archivo descomprimido y segundo objeto de configuración
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true, //Permite los loop para parafos
      linebreaks: true, //Permite que cuando genere el documento contenga los salto de linea
      modules: [new ImageModule(imageOpts)], //Agregar el módulo de imágenes
      parser(tag) {
        return {
          get(scope) {
            //Inicamos si no existe un propiedad especifica devuelva el objeto completamente
            if (tag === '.') return scope;
            return scope[tag] || ''; //Maneja las etiquetas correctamente
          },
        };
      },
    });

    //console.log('Datos cargados en la plantilla:', reporteJSON);

    const firmaAprendizPath =
      getFirmaPath(usuarioAprendiz?.firma) ?? imgTransparante;
    const FirmaInstructorPath =
      getFirmaPath(instructor?.firma) ?? imgTransparante;
    // console.log(
    //   'Firmas:',
    //   usuarioAprendiz?.firma,
    //   firmaAprendizPath,
    //   FirmaInstructorPath
    // );

    // if (!FirmaInstructorPath || !firmaAprendizPath) {
    //   return ApiResponse.error(res, undefined, 'Firmas no encontradas.');
    // }

    //Fecha por default en caso de no mandarse
    const fechaGeneracion = new Date().toISOString().split('T')[0];

    /**
     * Asignación de datos
     */

    // Desestructuración de las propiedades principales de reporteJSON
    const {
      infoGeneral = {},
      // infoAprendiz = {},
      // infoEmpresa = {},
      infoPlaneacion = {},
      infoSeguimiento = {},
      evaluacionFinal = {},
      // infoInstructor = {},
    } = reporteJSON;

    //Desestructuración de las propiedades dentro de infoPlaneación
    const { actividadesDesarrolladas = [], observacionesPlaneacion = '' } =
      infoPlaneacion;

    // Desestructuración de las propiedades dentro de infoSeguimiento
    const {
      infoSeguimientoInforme = {},
      factoresEvaluacion = {},
      observacionesEnteConformador = '',
      observacionesAprendiz = '',
    } = infoSeguimiento;

    // console.log(
    //   'infoInstructor:',
    //   infoInstructor.nombreInstructor,
    //   infoEmpresa.jefeInmediato
    // );

    // Desestructuración de las propiedades dentro de FactoresEvaluacion
    const { actitudinalesComportamentales = {}, tecnicos = {} } =
      factoresEvaluacion;

    //Llenar los datos en la plantilla con el JSON
    doc.render({
      //Información General
      Regional: infoGeneral.regional || 'No especificado',
      Centroformacion: infoGeneral.centroFormacion || 'No especificado',
      ProgramaFormacion: ficha.nombrePrograma || 'No especificado',
      NumeroFicha: ficha.numeroFicha || 'No especificado',

      //Información General -> Datos del Aprendiz
      NombreAprendiz:
        `${usuarioAprendiz.nombre} ${usuarioAprendiz.apellido}` ||
        'No especificado',
      IdentificacionAprendiz:
        usuarioAprendiz.numeroDocumento || 'No especificado',
      TelefonoAprendiz: usuarioAprendiz.telefono || 'No especificado',
      AlternativaAprendiz:
        relacionEmpresaAprendiz.alternativa || 'No especificado',
      EmailAprendiz: usuarioAprendiz.correoElectronico || 'No especificado',

      //Información General -> Ente conformador
      RazonSocial: empresa.razonSocial || 'No especificado',
      NitEmpresa: empresa.nit || 'No especificado',
      DireccionEmpresa: empresa.direccion || 'No especificado',
      JefeInmediato: relacionEmpresaAprendiz.jefeInmediato || 'No especificado',
      CargoJefe: relacionEmpresaAprendiz.cargoJefe || 'No especificado',
      TelefonoJefe: relacionEmpresaAprendiz.telefonoJefe || 'No especificado',
      EmailJefe:
        relacionEmpresaAprendiz.correoElectronicoJefe || 'No especificado',

      //Planeación Etapa Productiva
      InfoPlaneacion: actividadesDesarrolladas.map((celdaItem) => ({
        Actividades: celdaItem.actividades || 'No especificado',
        Evidencias: celdaItem.evidencias || 'No especificado',
        Fecha: celdaItem.fecha || 'No especificado',
        Lugar: celdaItem.lugar || 'No especificado',
      })),

      //Observaciones
      ObservacionesPlaneacion: observacionesPlaneacion || 'No especificado',

      //Seguimiento Etapa Productiva

      //Seguimiento Etapa Productiva -> Tipo informe
      TipoParcial: infoSeguimientoInforme.tipoInforme === true ? 'X' : '',
      TipoFinal: infoSeguimientoInforme.tipoInforme === false ? 'X' : '',
      InicioPeriodoEvaluado:
        infoSeguimientoInforme.inicioPeriodoEvaluado || fechaGeneracion,
      FinalizacionPeriodoEvaluado:
        infoSeguimientoInforme.finalizacionPeriodoEvaluado || fechaGeneracion,

      //Seguimiento Etapa Productiva -> Factores actitudinales y comportamentales
      RelacionesSatisfactorio:
        actitudinalesComportamentales.relacionesInterpersonales === true
          ? 'X'
          : '',
      RelacionesMejorar:
        actitudinalesComportamentales.relacionesInterpersonales === false
          ? 'X'
          : '',
      RelacionesObservacion:
        actitudinalesComportamentales.relacionObservacion ||
        'No hay Observacion',
      TrabajoSatisfactorio:
        actitudinalesComportamentales.trabajoEnEquipo === true ? 'X' : '',
      TrabajoMejorar:
        actitudinalesComportamentales.trabajoEnEquipo === false ? 'X' : '',
      TrabajoObservacion:
        actitudinalesComportamentales.trabajoObservacion ||
        'No hay Observacion',
      SolucionSatisfactorio:
        actitudinalesComportamentales.solucionProblemas === true ? 'X' : '',
      SolucionMejorar:
        actitudinalesComportamentales.solucionProblemasObservacion === false
          ? 'X'
          : '',
      SolucionObservacion:
        actitudinalesComportamentales.solucionobservacion ||
        'No hay Observacion',
      CumplimientoSatisfactorio:
        actitudinalesComportamentales.cumplimiento === true ? 'X' : '',
      CumplimientoMejorar:
        actitudinalesComportamentales.cumplimiento === false ? 'X' : '',
      CumplimientoObservacion:
        actitudinalesComportamentales.cumplimientoObservacion ||
        'No hay Observacion',
      OrganizacionSatisfactorio:
        actitudinalesComportamentales.organizacion === true ? 'X' : '',
      OrganizacionMejorar:
        actitudinalesComportamentales.organizacion === false ? 'X' : '',
      OrganizacionObservacion:
        actitudinalesComportamentales.organizacionObservacion ||
        'No hay Observacion',

      //Seguimiento Etapa Productiva -> Técnicos
      TransferenciaSatisfactorio:
        tecnicos.transferenciaConocimiento === true ? 'X' : '',
      TransferenciaMejorar:
        tecnicos.transferenciaConocimiento === false ? 'X' : '',
      TransferenciaObservacion:
        tecnicos.transferenciaObservacion || 'No hay Observacion',
      MejoraSatisfactorio: tecnicos.mejoraContinua === true ? 'X' : '',
      MejoraMejorar: tecnicos.mejoraContinua === false ? 'X' : '',
      MejoraObservacion:
        tecnicos.mejoraContinuaObservacion || 'No hay Observacion',
      FortalacemientoSatisfactorio:
        tecnicos.fortalecimientOcupacional === true ? 'X' : '',
      FortalacemientoMejorar:
        tecnicos.fortalecimientOcupacional === false ? 'X' : '',
      FortalacemientoObservacion:
        tecnicos.fortalecimientoObservacion || 'No hay Observacion',
      CalidadSatisfactorio: tecnicos.calidad === true ? 'X' : '',
      CalidadMejorar: tecnicos.calidad === false ? 'X' : '',
      CalidadObservacion: tecnicos.calidadObservacion || 'No hay Observacion',
      AmbientalSatisfactorio: tecnicos.ambiental === true ? 'X' : '',
      AmbientalMejorar: tecnicos.ambiental === false ? 'X' : '',
      AmbientalObservacion:
        tecnicos.ambientalObservacion || 'No hay Observacion',
      AdministracionSatisfactorio: tecnicos.administracion === true ? 'X' : '',
      AdministracionMejorar: tecnicos.administracion === false ? 'X' : '',
      AdministracionObservacion:
        tecnicos.administracionObservacion || 'No hay Observacion',
      SeguridadSatisfactorio: tecnicos.seguridad === true ? 'X' : '',
      SeguridadMejorar: tecnicos.seguridad === false ? 'X' : '',
      SeguridadObservacion:
        tecnicos.seguridadObservacion || 'No hay Observacion',
      DocumentacionSatisfactorio: tecnicos.documentacion === true ? 'X' : '',
      DocumentacionMejorar: tecnicos.documentacion === false ? 'X' : '',
      DocumentacionObservacion:
        tecnicos.documentacionObservacion || 'No hay Observacion',

      //Observaciones de seguimiento
      ObservacionesEnteConformador:
        observacionesEnteConformador || 'No especificado',
      ObservacionesAprendiz: observacionesAprendiz || 'No especificado',

      //Evaluacion de Etapa Productiva  -> Jucios
      JuicioEvaluacionAprobado:
        evaluacionFinal.juicioEvaluacion === true ? 'X' : '',
      JuicioEvaluacionNoAprobado:
        evaluacionFinal.juicioEvaluacion === false ? 'X' : '',

      //Evaluacion de Etapa Productiva -> Reconocimientos
      ReconocimientosEspecialesSi:
        evaluacionFinal.reconocimientosEspeciales === true ? 'X' : '',
      ReconocimientosEspecialesNo:
        evaluacionFinal.reconocimientosEspeciales === false ? 'X' : '',
      ReconocimientosEspecialesLista:
        evaluacionFinal.reconocimientosEspeciales === true
          ? evaluacionFinal.reconocimientosEspecialesLista
          : '',

      //Datos de creacion del informe
      CuidadElaboracion: evaluacionFinal.cuidadElaboracion || '',
      FechaGeneracionInforme:
        evaluacionFinal.fechaGeneracionInforme || fechaGeneracion,

      //Agregar la firma de forma Global y nombres
      NombreInstructorSeguimiento:
        ` ${instructor.nombre}  ${instructor.apellido}` || '',
      FirmaAprendiz: firmaAprendizPath,
      FirmaInstructor: FirmaInstructorPath,
    });

    const nombreRerportAprendiz = `${ficha.numeroFicha}_${usuarioAprendiz.nombre}_${usuarioAprendiz.apellido}_${idReporte}`;
    //Generamos el nombre del documento docx
    const nombreReporteFormatoDOCX = generateFileNameWithExtension(
      idFichaAprendiz,
      'docx',
      'reporte_GFPI_F_023',
      nombreRerportAprendiz
    );

    //Obtener el documento generado y convertilo en un formato binario compatible con node.js
    const bufferDocumentoWord = doc.getZip().generate({ type: 'nodebuffer' });

    //Son incesarias
    //Definir la ruta donde queremos guardar el archivo Word
    // const rutaReporteDOCX = path.join(
    //   BASE_UPLOAD_PATH,
    //   `/fichas/ficha_${numeroFicha}`,
    //   nombreReporteFormatoDOCX
    // );

    // //Obtenemos la ruta del carpeta
    // const outputFolder = path.dirname(rutaReporteDOCX);
    // if (!fs.existsSync(outputFolder)) {
    //   fs.mkdirSync(outputFolder, { recursive: true });
    // }

    // //Guardar el archivo generado
    // fs.writeFileSync(rutaReporteDOCX, buf);

    // return ApiResponse.success(
    //   res,
    //   { nombreReporte: nombreReporteFormatoDOCX },
    //   'Reporte Word generado exitosamente.'
    // );

    return { bufferDocumentoWord, nombreReporteFormatoDOCX };
  } catch (error) {
    console.error('Error en crear el reporte Word:', error);
    return { error: 'Error al generar el reporte Word.' };
  }
};
