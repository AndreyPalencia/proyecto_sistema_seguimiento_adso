import pkg from 'bcryptjs';
const { hash, compare } = pkg;
import { randomBytes } from 'crypto';

const encryptionUtil = {
  //Encriptacion de la contrasenia
  hashPassword: async (password) => {
    try {
      const passwordString = String(password);
      return await hash(passwordString, 10);
    } catch (error) {
      console.error('Error al encriptar la constraseña', error);
      return null;
    }
  },

  //Comparacion de la contrasenias
  comparePassword: async (password, hashPassword) => {
    try {
      const passwordToCompare = String(password);
      return await compare(passwordToCompare, hashPassword);
    } catch (error) {
      console.error('Error comparar las contraseñas', error);
      return false;
    }
  },
};

export const generateSecurePassword = (length = 12) => {
  return randomBytes(length).toString('base64').slice(0, length);
};

export default encryptionUtil;
