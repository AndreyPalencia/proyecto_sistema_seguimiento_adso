import models from '../../../models/index.js';
const { FichaAprendiz, Empresa, Usuario, Bitacora, Agendamiento, Ficha } =
  models;
import ApiResponse from '../../../utils/apiResponse.js';

export const reporteFichaAprendices = async (req, res) => {
  try {
    const { reportes, ficha, aprendiz, empresa } = req.body;
    const { bitacorasAprobadas = true, visitasRealizadas = true } = reportes;

    const filtrosAprendiz = Object.entries(aprendiz)
      .filter(([_, valor]) => valor)
      .map(([campo]) => campo);
    if (filtrosAprendiz.includes('nombre')) {
      filtrosAprendiz.push('apellido');
    }
    const filtroEmpresa = Object.entries(empresa)
      .filter(([_, valor]) => valor)
      .map(([campo]) => campo);

    const fichaAprendiz = await FichaAprendiz.findAll({
      where: { idFicha: ficha },
      include: [
        { model: Usuario, attributes: filtrosAprendiz },
        { model: Empresa, attributes: filtroEmpresa },
        {
          model: Bitacora,
          attributes: ['numeroBitacora'],
          where: { estadoBitacora: bitacorasAprobadas },
          required: false,
        },
        {
          model: Agendamiento,
          attributes: ['numeroVisita'],
          where: visitasRealizadas ? { estadoVisita: 'Realizada' } : undefined,
          required: false,
        },
      ],
    });

    const infoFicha = await Ficha.findByPk(ficha, {
      include: [
        {
          model: Usuario,
          attributes: [
            'numeroDocumento',
            'nombre',
            'apellido',
            'correoElectronico',
          ],
        },
      ],
    });

    // ⚠️ Validar si no hay datos suficientes para generar el reporte
    if (!infoFicha || fichaAprendiz.length === 0) {
      return ApiResponse.error(
        res,
        null,
        'No se puede generar el reporte: no hay información suficiente.'
      );
    }

    // ✅ Si hay datos suficientes, generar respuesta con éxito
    return {
      fichaInfoDisponible: true,
      cantidadAprendices: fichaAprendiz.length,
      infoFicha,
      fichaAprendiz,
      filtrosAprendiz,
      filtroEmpresa,
    };
    // return ApiResponse.success(res, {
    //   message: 'Reporte generado con éxito.',
    //   fichaInfoDisponible: true,
    //   cantidadAprendices: fichaAprendiz.length,
    //   infoFicha,
    //   fichaAprendiz,
    //   filtrosAprendiz,
    ///  filtroEmpresa
    // });
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    return ApiResponse.error(res, error, 'Error al generar el PDF');
  }
};
