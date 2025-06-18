import models from '../../models/index.js';
const { FichaAprendiz, Usuario, Ficha } = models;
import ApiResponse from '../../utils/apiResponse.js';
import { Sequelize } from 'sequelize';
import { sendFichaAddedEmail } from '../../services/mailerService.js';

export const createFichaAprendiz = async (req, res) => {
  try {
    if (req.body.correoElectronicoJefe) {
      req.body.correoElectronicoJefe =
        req.body.correoElectronicoJefe.toLowerCase();
    }
    const fichaAprendizCreado = await FichaAprendiz.create(req.body);

    const { idFichaAprendiz } = fichaAprendizCreado;

    const infoFichaUsuarios = await FichaAprendiz.findByPk(idFichaAprendiz, {
      include: [
        {
          model: Usuario, // Usuario from FichaAprendiz
        },
        {
          model: Ficha, //Relación con Ficha
          as: 'Ficha', //Alias de la relación Ficha -> FichaAprendiz
          include: [
            {
              model: Usuario, //Relación con Usuario (Instructor)
              as: 'Usuario', //Alias de la relación entre Ficha y Usuario
              //attributes: ['idUsuario', 'nombre', 'apellido', 'firma'],
            },
          ],
        },
      ],
    });

    // If the email logic is needed after fetching the info
    const usuario = infoFichaUsuarios.Usuario;
    const instructor = infoFichaUsuarios.Ficha
      ? infoFichaUsuarios.Ficha.Usuario
      : null;
    const fichaInfo = infoFichaUsuarios.Ficha;
    await sendFichaAddedEmail(usuario, instructor, fichaInfo);

    return ApiResponse.created(
      res,
      undefined,
      'Se creo exitosamente la realcion entre el aprendiz y la ficha.'
    );
  } catch (error) {
    console.error(
      'Error al crear la relacion entre el aprendiz y la ficha:',
      error
    );
    if (error instanceof Sequelize.UniqueConstraintError) {
      return ApiResponse.conflict(
        res,
        null,
        'El aprendiz ya esta registrado en esta ficha.'
      );
      // O puedes ser más específico si sabes qué campos son únicos:
      // const camposConflictivos = error.errors.map(e => e.path).join(', ');
      // return res.status(409).json({ mensaje: `Ya existe un registro con los mismos valores para: ${camposConflictivos}.` });
    }

    return ApiResponse.error(
      res,
      error,
      'Error al crear la relacion entre el aprendiz y la ficha.'
    );
  }
};
