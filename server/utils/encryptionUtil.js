import pkg from 'bcryptjs';
const { hash, compare } = pkg;

const encryptionUtil = {
  //Encriptacion de la contrasenia
  hashPassword: async (password) => {
    try {
      const hashPassword = await hash(password, 10);
      return hashPassword;
    } catch (error) {
      console.error('Error al encriptar la constraseña', error);
      return null;
    }
  },

  //Comparacion de la contrasenias
  comparePassword: async (password, hashPassword) => {
    try {
      return await compare(password, hashPassword);
    } catch (error) {
      console.error('Error comparar las contraseñas');
      return false;
    }
  },
};

export default encryptionUtil;
