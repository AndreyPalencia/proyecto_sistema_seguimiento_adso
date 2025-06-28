import { z } from 'zod';

const tiposDeDocumento = ['CC', 'TI', 'CE', 'PEP', 'PPT'];
const rolesPermitidos = ['aprendiz', 'admin', 'instructor'];

const formUsuarios = z.object({
  tipoDocumento: z.enum(tiposDeDocumento, {
    errorMap: () => ({ message: 'Seleccione un tipo de documento válido' }),
  }),
  numeroDocumento: z.coerce
    .string()
    .min(6, 'El número de documento debe tener al menos 6 dígitos.')
    .regex(/^\d+$/, 'El número de documento debe contener solo números')
    .refine((val) => Number(val) <= 4294967295, {
      message: 'El número de documento no puede ser mayor a 4,294,967,295.',
    })
    .transform((val) => Number(val)),

  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellido: z.string().min(1, 'El apellido es obligatorio'),
  telefono: z.coerce
    .number({
      required_error: 'El teléfono es obligatorio.',
      invalid_type_error: 'El teléfono debe ser un número.',
    })
    .min(1000000, {
      message: 'El teléfono debe tener al menos 7 dígitos.',
    })
    .max(9999999999, {
      message: 'El teléfono no puede tener más de 10 dígitos.',
    }),
  correoElectronico: z
    .string()
    .nonempty({ message: 'El correo electrónico no puede estar vacío.' })
    .email({ message: 'El correo electrónico no tiene un formato válido.' }),

  archivo: z
    .instanceof(File, { message: 'Debe seleccionar un archivo válido.' })
    .optional(),
  // .refine((file) => file.size > 0, {
  //   message: 'Debe seleccionar un archivo válido.',
  // }),
  rol: z.enum(rolesPermitidos, {
    errorMap: () => ({
      message: 'Seleccione un rol válido (aprendiz, admin o instructor)',
    }),
  }),
});

export const formBuscarAprendiz = z
  .object({
    numeroDocumento: z
      .union([z.string(), z.number()])
      .transform((val) => (val === '' ? undefined : Number(val)))
      .refine((val) => !val || /^\d{4,}$/.test(val.toString()), {
        message: 'El número de documento debe tener al menos 4 dígitos.',
      })
      .optional(),
    estadoUsuario: z.enum(['1', '0']).optional(),
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    correoElectronico: z.string().optional(),
  })
  .refine(
    (data) =>
      Object.values(data).some((value) => value !== undefined && value !== ''),
    {
      message: 'Debe ingresar al menos un criterio de búsqueda.',
      path: ['numeroDocumento'],
    }
  )
  .refine((data) => !(data.estadoUsuario && !data.numeroDocumento), {
    message: 'Debe ingresar el número de documento si selecciona un estado.',
    path: ['numeroDocumento'],
  });
export default formUsuarios;
