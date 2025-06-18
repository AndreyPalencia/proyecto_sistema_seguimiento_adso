import models from '../../models/index.js';
const { Agendamiento, FichaAprendiz, Ficha, Usuario } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { transformarAgendamiento } from '../../utils/agendamientos.js';
import { sendSolicitudAgendamientoEmail } from '../../services/mailerService.js';
//Crear Agendamiento
export const createAgendamiento = async (req, res) => {
  try {
    const agendamientoCreado = await Agendamiento.create(req.body);

    const agendamientoFichaAprendiz = await Agendamiento.findByPk(
      agendamientoCreado.idAgendamiento,
      {
        include: [
          {
            model: FichaAprendiz,
            include: [
              {
                model: Usuario, // Sin alias 'as'
                attributes: [
                  'nombre',
                  'apellido',
                  'correoElectronico',
                  'tipoDocumento',
                  'numeroDocumento',
                ],
              },
              {
                model: Ficha,
                attributes: ['nombrePrograma', 'numeroFicha', 'idFicha'],
                include: [
                  {
                    model: Usuario, // Sin alias 'as'
                    attributes: ['nombre', 'apellido', 'correoElectronico'],
                  },
                ],
              },
            ],
          },
        ],
      }
    );

    const agendamientoPlain = agendamientoFichaAprendiz.toJSON();
    const { FichaAprendiz: fichaAprendiz, ...agendamiento } = agendamientoPlain;

    if (!agendamiento) {
      return ApiResponse.notFound(res, 'Agendamiento no encontrado.');
    }

    if (agendamiento.estadoVisita == 'Solicitud') {
      await sendSolicitudAgendamientoEmail(agendamiento, fichaAprendiz);
    }

    const agendamientoTransformado = transformarAgendamiento(
      agendamientoFichaAprendiz
    );

    return ApiResponse.created(
      res,
      agendamientoTransformado,
      'Agendamiento creado exitosamente.'
    );
  } catch (error) {
    console.error('Error al crear el agendamiento:', error);
    return ApiResponse.error(res, error, 'Error al crear el agendamiento.');
  }
};
