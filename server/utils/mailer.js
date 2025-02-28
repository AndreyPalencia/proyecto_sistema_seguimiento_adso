import nodemailer from 'nodemailer';
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
import ApiResponse from './apiResponse.js';

//Enviar email con link para recuperar contraseña
const transporter = nodemailer.createTransport({
  host: SMTP_HOST, //Servidor del Cpanel
  port: SMTP_PORT, //Puerto SSL
  secure: false, //true
  auth: {
    user: SMTP_USER, //Correo del Cpanel
    pass: SMTP_PASS, //Contraseña del Cpanel
  },
  connectionTimeout: 60000,
});

/**
 * Enviar un correo electrónico
 * @param {Object} options - Configuración del correo
 * @param {string} options.to - Destinatario
 * @param {string} options.subject - Asunto del correo
 * @param {string} options.text - Texto plano del mensaje
 * @param {string} options.html - Mensaje en HTML (opcional)
 */
export const sendEmail = async (to, subject, text, html) => {
  try {
    const infoEmail = await transporter.sendMail({
      from: `Soporte Correos ${SMTP_USER}`,
      to,
      subject,
      text, //Solo texto (opcinal)
      html,
    });

    console.log('Correo enviado', infoEmail);
    return { success: true, info: infoEmail };
  } catch (error) {
    console.error('Error al enviar el correo', error);
    return { success: false, error };
  }
};
