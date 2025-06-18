import { useCrearNotificacion } from './useCrearNotificacion';
import { useCrearNotificacionSelf } from './useCrearNotificacionSelf';

const useNotificacionesDefault = () => {
  const { fetchCrearNotificacion, loading } = useCrearNotificacion();
  const { fetchCrearNotificacionSelf, loadingNotificacion } =
    useCrearNotificacionSelf();

  const fechaCreacion = new Date().toISOString().slice(0, 10);

  // Función para notificar al nuevo usuario (email, idUsuario)
  const notificarNuevoUsuario = async (idUsuario) => {
    return await fetchCrearNotificacion({
      tipo: 'Informacion',
      titulo: '¡Bienvenido!',
      mensaje: 'Tu cuenta ha sido creada con éxito.',
      fechaCreacion,
      idUsuario, // Pasamos el idUsuario aquí
    });
  };

  // Función para notificar solicitud nueva de bitácora (añadir parámetros si es necesario)
  const notificarSolicitudNuevaBitacora = async (
    idUsuario,
    bitacora,
    ficha
  ) => {

    console.log('data', idUsuario, bitacora, ficha)
    const { numeroBitacora, observacion } = bitacora;
    const { nombrePrograma, numeroFicha } = ficha;
    return await fetchCrearNotificacion({
      tipo: 'Alerta',
      titulo: `Reenvío requerido: Bitácora ${numeroBitacora} Ficha: ${numeroFicha} - ${nombrePrograma} `,
      mensaje: `Se requiere que vuelvas a subir la bitácora número ${numeroBitacora}. ${
        observacion ? `<strong>Observación: </strong> ${observacion}` : ''
      }
      `,
      fechaCreacion,
      idUsuario, // Pasamos el idUsuario aquí
    });
  };

  const notificarSolicitudDocumento = async (idUsuario, documento, ficha) => {
    const { tipoDocumento, observacion } = documento;
    const { nombrePrograma, numeroFicha } = ficha;
    return await fetchCrearNotificacion({
      tipo: 'Informacion',
      titulo: `Reenvío requerido Documento: ${tipoDocumento} - Ficha: ${numeroFicha} - ${nombrePrograma} `,
      mensaje: `Se requiere que vuelvas a subir el documento ${tipoDocumento}. ${
        observacion ? `<strong>Observación: </strong> ${observacion}` : ''
      } `,
      fechaCreacion,
      idUsuario, // Pasamos el idUsuario aquí
    });
  };

  const notificarAgendamientoVisita = async (
    idUsuario,
    agendamiento,
    ficha
  ) => {
    const {
      herramientaReunion,
      enlaceReunion,
      fechaInicio,
      fechaFin,
      estadoVisita,
      tipoVisita,
      numeroVisita,
    } = agendamiento;

    const { nombrePrograma, numeroFicha } = ficha;

    const titulo = `Agendamiento de visita ${tipoVisita} - Ficha ${numeroFicha}`;
    const mensaje = `
      Se ha agendado una visita de tipo ${tipoVisita} (${estadoVisita}):
      - Número de visita: ${numeroVisita}
      ${herramientaReunion && `- Herramienta: ${herramientaReunion}`}
      ${enlaceReunion && ` - Enlace: ${enlaceReunion}`}
      - Fecha: ${new Date(fechaInicio).toLocaleString()} a ${new Date(
      fechaFin
    ).toLocaleString()}
      - Programa: ${nombrePrograma}
    `;

    const fechaCreacion = new Date().toISOString();

    return await fetchCrearNotificacion({
      tipo: 'Solicitud',
      titulo,
      mensaje,
      fechaCreacion,
      idUsuario,
    });
  };

  // Función para notificar éxito en una acción (email, accion, idUsuario)
  const notificarExito = async (accion, idUsuario) => {
    return await fetchCrearNotificacion({
      tipo: 'Exito',
      titulo: 'Éxito',
      mensaje: `La acción "${accion}" se completó correctamente.`,
      fechaCreacion,
      idUsuario, // Pasamos el idUsuario aquí
    });
  };

  return {
    notificarNuevoUsuario,
    notificarSolicitudNuevaBitacora,
    notificarSolicitudDocumento,
    notificarAgendamientoVisita,
    notificarExito,
    loading,
  };
};

export { useNotificacionesDefault };
