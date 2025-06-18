import models from '../../models/index.js';
const { Agendamiento, FichaAprendiz, Ficha, Usuario } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { transformarAgendamiento } from '../../utils/agendamientos.js';
import { notificarConfirmacionAgendamiento } from '../../services/notificationService.js';

//Modificar un agendamiento por ID
export const updateAgendamiento = async (req, res) => {
  const { idAgendamiento } = req.params;
  let isSolicitud = false;
  try {
    const agendamientoExistente = await Agendamiento.findByPk(idAgendamiento);

    if (!agendamientoExistente) {
      return ApiResponse.notFound(res, 'Agendamiento no encontrado.');
    }

    if (agendamientoExistente.estadoVisita === 'Solicitud') {
      isSolicitud = true;
    }

    const [updateRow] = await Agendamiento.update(req.body, {
      where: {
        idAgendamiento: idAgendamiento,
      },
    });

    if (updateRow === 0) {
      return ApiResponse.notFound(
        res,
        'Agendamiento no encontrado o se modifico.'
      );
    }

    const agendamientoActualizado = await Agendamiento.findByPk(
      idAgendamiento,
      {
        include: [
          {
            model: FichaAprendiz,
            attributes: ['idFichaAprendiz'],
            include: [
              {
                model: Ficha,
                attributes: ['idFicha', 'nombrePrograma', 'numeroFicha'],
              },
              {
                model: Usuario,
                attributes: ['idUsuario'],
              },
            ],
          },
        ],
      }
    );

    //console.log({agendamientoActualizado})

    //Transformar para limpiar y agregar idFicha directamente
    const agendamientoTransformado = transformarAgendamiento(
      agendamientoActualizado
    );

    const idUsuario = agendamientoActualizado.FichaAprendiz?.Usuario?.idUsuario;
    const ficha = agendamientoActualizado.FichaAprendiz?.Ficha;


    if (isSolicitud && agendamientoTransformado && idUsuario && ficha) {
      await notificarConfirmacionAgendamiento(
        idUsuario,
        agendamientoTransformado,
        ficha
      );
    }

    return ApiResponse.success(
      res,
      agendamientoTransformado,
      'Agendamiento actualizado exitosamente.'
    );
  } catch (error) {
    console.error(
      'Error en la actualización de los datos del Agendamiento:',
      error
    );
    return ApiResponse.error(
      res,
      error,
      'Error en la actualizacion de los datos del Agendamiento.'
    );
  }
};
