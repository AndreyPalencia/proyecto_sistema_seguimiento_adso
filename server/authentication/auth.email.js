import { sendEmail } from '../utils/mailer.js';
const { FRONTEND_URL } = process.env;

export const sendPasswordRecoverEmail = async (usuario, resetToken) => {
  //Por el mometo la ruta esta en back pero debe de ir en Front
  const resetUrl = `${FRONTEND_URL}/auth/reset-password/confirm/${resetToken}`;

  const subject = 'Recuperación de contraseña';
  const text = `Haz clic en el siguiente enlace para recuperar tu contraseña: ${resetUrl}`;
  const html = `
    <h1>Recuperación de contraseña</h1>
    <p>Haz clic en el siguiente enlace para recuperar tu contraseña:</p>
    <a href="${resetUrl}">Recuperar contraseña</a>
  `;
  return sendEmail(usuario.correoElectronico, subject, text, html);
};

export const sendResetPasswordConfirmationEmail = async (usuario) => {
  const subject = 'Cambio de contraseña exitoso';
  const html = `
    Hola ${usuario.nombre}, tu contraseña ha sido cambiada exitosamente. 
    Si no fuiste tú, restablece tu contraseña aquí: <a href="${FRONTEND_URL}/auth/reset-password/request">Recuperar contraseña</a> 
  `;
  return sendEmail(usuario.correoElectronico, subject, undefined, html);
};
