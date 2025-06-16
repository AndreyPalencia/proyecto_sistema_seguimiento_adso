import { generarNotificacion } from '../controllers/notificaciones/generarNotificacion.js';

export const notificarConfirmacionAgendamiento = async (
  idUsuario,
  agendamiento,
  ficha
) => {
  const {
    herramientaReunion,
    enlaceReunion,
    fechaInicio,
    fechaFin,
    tipoVisita,
    numeroVisita,
  } = agendamiento;

  console.log('DATAOS');

  const { nombrePrograma, numeroFicha } = ficha;
  const fechaCreacion = new Date().toISOString().split('T')[0];

  const titulo = `Confirmación de agendamiento de visita ${tipoVisita} - Ficha ${numeroFicha}`;
  const mensaje = `
  Tu agendamiento de visita tipo ${tipoVisita} ha sido confirmado:
  - Número de visita: ${numeroVisita}
  ${herramientaReunion ? `- Herramienta: ${herramientaReunion}\n` : ''}
  ${enlaceReunion ? `- Enlace: ${enlaceReunion}\n` : ''}
  - Fecha: ${new Date(fechaInicio).toLocaleString()} a ${new Date(
    fechaFin
  ).toLocaleString()}
  - Programa: ${nombrePrograma}
  
  Gracias por confirmar.
  `;

  return await generarNotificacion({
    tipo: 'Informacion',
    titulo,
    mensaje,
    fechaCreacion,
    idUsuario,
    estado: 'NoLeida',
  });
};
