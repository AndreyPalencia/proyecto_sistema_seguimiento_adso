import { z } from 'zod';

const tiposDeDocumento = ['CC', 'TI', 'CE', 'PEP', 'PPT'];
const tipoRoles = ['admin', 'instructor', 'aprendiz'];

const formUserLogin = z.object({
  tipoDocumento: z.enum(tiposDeDocumento, {
    errorMap: () => ({ message: 'Seleccione un tipo de documento válido' }),
  }),
  numeroDocumento: z
    .string()
    .min(6, 'El número de documento debe tener al menos 6 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rol: z.enum(tipoRoles, {
    errorMap: () => ({ message: 'Seleccione un rol válido' }),
  }),
});
export default formUserLogin;
