import models from '../../../models/index.js';
const { Empresa, Agendamiento, FichaAprendiz, Usuario } = models;
import { Op } from 'sequelize';

export const reporteAgendamientosMaps = async ({
  idInstructor,
  fechaBusqueda,
}) => {
  if (!fechaBusqueda) {
    throw new Error('fechaBusqueda es obligatorio');
  }

  const inicioDia = new Date(`${fechaBusqueda}T00:00:00.000Z`);
  const finDia = new Date(`${fechaBusqueda}T23:59:59.999Z`);

  const agendamientos = await Agendamiento.findAll({
    where: {
      fechaInicio: { [Op.between]: [inicioDia, finDia] },
      idInstructor,
    },
    order: [['fechaInicio', 'ASC']],
    attributes: ['fechaInicio', 'fechaFin', 'tipoVisita'],
    include: [
      {
        model: FichaAprendiz,
        attributes: ['idFichaAprendiz'],
        include: [
          {
            model: Empresa,
            attributes: {
              exclude: ['idEmpresa'],
            },
          },
          {
            model: Usuario,
            attributes: [
              'tipoDocumento',
              'numeroDocumento',
              'nombre',
              'apellido',
            ],
          },
        ],
      },
    ],
  });

  if (agendamientos.length === 0) {
    throw new Error(
      'No se encontraron agendamientos para la fecha e instructor dados.'
    );
  }

  const direccionesEmpresa = agendamientos
    .filter((item) => item.tipoVisita === 'Presencial') // keep only presencial
    .map((item) => item.FichaAprendiz?.Empresa?.direccion)
    .filter(Boolean);

  if (direccionesEmpresa.length < 2) {
    throw new Error('No hay suficientes direcciones para generar la ruta.');
  }

  const agendamientosResultado = agendamientos.map((item) => {
    const { fechaInicio, fechaFin, tipoVisita, FichaAprendiz } = item;
    const empresa = FichaAprendiz?.Empresa || {};
    const usuario = FichaAprendiz?.Usuario || {};

    return {
      fechaInicio,
      fechaFin,
      tipoVisita,
      empresaNit: empresa.nit || null,
      empresaRazonSocial: empresa.razonSocial || null,
      empresaTelefono: empresa.telefono || null,
      empresaCorreoElectronico: empresa.correoElectronico || null,
      empresaDireccion: empresa.direccion || null,
      usuarioTipoDocumento: usuario.tipoDocumento || null,
      usuarioNumeroDocumento: usuario.numeroDocumento || null,
      usuarioNombre: usuario.nombre || null,
      usuarioApellido: usuario.apellido || null,
    };
  });


  const destination = direccionesEmpresa[direccionesEmpresa.length - 1];
  const waypoints = direccionesEmpresa.slice(0, -1);


  return {
    destination,
    waypoints,
    direccionesEmpresa,
    agendamientosResultado,
  };
};
