import { sendEmail } from '../utils/mailer.js';
const { FRONTEND_URL } = process.env;

export const sendWelcomeEmailToSAEP = async (usuario, passwordPlano) => {
  const subject = 'Bienvenido a la plataforma SAEP';

  // <p><strong>Correo de acceso:</strong> ${usuario.correoElectronico}</p>
  const html = `
    <h1>¡Bienvenido(a) a SAEP, ${usuario.nombre} ${usuario.apellido}!</h1>
    <p>Tu cuenta ha sido creada exitosamente.</p>
    <p><strong>Tipo de documento:</strong> ${usuario.tipoDocumento}</p>
    <p><strong>Rol asignado:</strong> ${usuario.rol}</p>
    <p><strong>Contraseña temporal:</strong> ${passwordPlano}</p>
    <p>Por favor, inicia sesión y cambia tu contraseña lo antes posible para mantener tu cuenta segura.</p>
    <p><a href="${FRONTEND_URL}">Ir a la plataforma SAEP</a></p>
  `;

  const text = `
    Bienvenido(a) a SAEP, ${usuario.nombre}!
    Tu cuenta ha sido creada.

    Rol: ${usuario.rol}
    Tipo de documento: ${usuario.tipoDocumento}
    Contraseña: ${passwordPlano}

    Inicia sesión en: ${FRONTEND_URL}
  `;

  try {
    await sendEmail(usuario.correoElectronico, subject, text, html);
  } catch (err) {
    console.error('Error al enviar correo de bienvenida:', err.message);
  }
};

export const sendFichaAddedEmail = async (
  usuario,
  instructor,
  fichaDetails
) => {
  console.log(usuario, instructor, fichaDetails);
  const subject = 'Has sido asignado a una nueva Ficha en SAEP';

  // Create the email HTML content with the specific details
  const html = `
    <h1>¡Hola, ${usuario.nombre} ${usuario.apellido}!</h1>
    <p>Te informamos que has sido asignado(a) a una nueva ficha en la plataforma SAEP.</p>
    <p><strong>ID Ficha:</strong> ${fichaDetails.idFicha}</p>
    <p><strong>Número de Ficha:</strong> ${fichaDetails.numeroFicha}</p>
    <p><strong>Nombre del Programa:</strong> ${fichaDetails.nombrePrograma}</p>
    <p><strong>Terminación del Programa:</strong> ${
      fichaDetails.terminoPrograma
    }</p>
    <p><strong>Estado de la Ficha:</strong> ${fichaDetails.estadoFicha}</p>
    <p><strong>Inicio de Etapa Productiva:</strong> ${
      fichaDetails.inicioEtapaProductiva
    }</p>
    <p><strong>Fin de Etapa Productiva:</strong> ${
      fichaDetails.finEtapaProductiva
    }</p>
    <p>Por favor, accede a la plataforma para ver más detalles.</p>
    <p><strong>Instructor de Etapa:</strong> ${instructor.nombre ?? ''} ${
    instructor.apellido ?? ''
  }</p>
    <p><a href="${FRONTEND_URL}">Ir a la plataforma SAEP</a></p>
  `;

  // Create the plain text version of the email
  //ID Instructor: ${fichaDetails.id_instructor}
  const text = `
    ¡Hola, ${usuario.nombre}!

    Has sido asignado(a) a una nueva ficha en SAEP.

    ID Ficha: ${fichaDetails.idFicha}
    Número de Ficha: ${fichaDetails.numeroFicha}
    Nombre del Programa: ${fichaDetails.nombrePrograma}
    Terminación del Programa: ${fichaDetails.terminoPrograma}
    Estado de la Ficha: ${fichaDetails.estadoFicha}
    Inicio de Etapa Productiva: ${fichaDetails.inicioEtapaProductiva}
    Fin de Etapa Productiva: ${fichaDetails.finEtapaProductiva}
    Instructor de Etapa:</strong> ${instructor.nombre ?? ''} ${
    instructor.apellido ?? ''
  }

    
    Para más detalles, por favor accede a la plataforma: ${FRONTEND_URL}
    `;

  try {
    await sendEmail(usuario.correoElectronico, subject, text, html);
  } catch (err) {
    console.error('Error al enviar correo de ficha asignada:', err.message);
  }
};

export const sendSolicitudAgendamientoEmail = async (
  agendamiento,
  fichaAprendiz
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

  // Desestructuramos los datos de fichaAprendiz que ya vienen con relaciones incluidas
  const { Usuario: Aprendiz, Ficha } = fichaAprendiz;
  const { Usuario: Instructor } = Ficha;

  if (!Aprendiz || !Ficha || !Instructor) {
    throw new Error(
      'Faltan datos completos en fichaAprendiz para enviar el correo.'
    );
  }

  const subject = `Solicitud de agendamiento de visita - Ficha ${Ficha.numeroFicha}`;

  const html = `
    <h1>Solicitud de Agendamiento de Visita</h1>
    <p><strong>Aprendiz:</strong> ${Aprendiz.nombre} ${Aprendiz.apellido}</p>
    <p><strong>Tipo Documento:</strong> ${Aprendiz.tipoDocumento} - ${
    Aprendiz.numeroDocumento
  }</p>
    <p>Se ha solicitado una visita de tipo <strong>${tipoVisita}</strong>.</p>
    <ul>
      <li><strong>Estado:</strong> ${estadoVisita}</li>
      <li><strong>Número de visita:</strong> ${numeroVisita}</li>
      ${
        herramientaReunion &&
        ` <li>
            <strong>Herramienta de reunión:</strong> ${herramientaReunion}
          </li>`
      }
     ${
       enlaceReunion &&
       ` <li>
           <strong>Enlace de reunión:</strong>{' '}
           <a href="${enlaceReunion}">${enlaceReunion}</a>
         </li>`
     }
      <li><strong>Fecha de inicio:</strong> ${new Date(
        fechaInicio
      ).toLocaleString()}</li>
      <li><strong>Fecha de fin:</strong> ${new Date(
        fechaFin
      ).toLocaleString()}</li>
      <li><strong>Programa:</strong> ${Ficha.nombrePrograma}</li>
      <li><strong>Ficha:</strong> ${Ficha.numeroFicha}</li>
    </ul>
    <p>Por favor, revisa la plataforma SAEP para más detalles.</p>
    <p><a href="${FRONTEND_URL}">Ir a la plataforma SAEP</a></p>
  `;

  const text = `
    Solicitud de Agendamiento de Visita

    Aprendiz: ${Aprendiz.nombre} ${Aprendiz.apellido}
    Documento: ${Aprendiz.tipoDocumento} - ${Aprendiz.numeroDocumento}

    Tipo: ${tipoVisita}
    Estado: ${estadoVisita}
    Número de visita: ${numeroVisita}
    Herramienta: ${herramientaReunion}
    Enlace: ${enlaceReunion}
    Fecha inicio: ${new Date(fechaInicio).toLocaleString()}
    Fecha fin: ${new Date(fechaFin).toLocaleString()}
    Programa: ${Ficha.nombrePrograma}
    Ficha: ${Ficha.numeroFicha}

    Revisa más en: ${FRONTEND_URL}
  `;
  //console.log(Instructor.correoElectronico, subject, text, html);

  // Enviar correo al instructor
  try {
    await sendEmail(Instructor.correoElectronico, subject, text, html);
  } catch (err) {
    console.error(
      'Error al enviar correo de solicitud de agendamiento:',
      err.message
    );
  }
};
