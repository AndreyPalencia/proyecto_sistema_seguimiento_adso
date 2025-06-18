import { z } from 'zod';

const formEmail = z.object({
  correoElectronico: z
    .string()
    .trim() // Elimina espacios en blanco al inicio y al final
    .min(5, 'El correo es demasiado corto') // Mínimo 5 caracteres
    .max(50, 'El correo es demasiado largo') // Máximo 50 caracteres
    .email('El formato del correo es inválido'),
});
export default formEmail;
