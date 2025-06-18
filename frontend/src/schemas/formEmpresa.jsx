import { z } from 'zod';

// Función que ajusta el NIT para agregar el dígito de verificación si no tiene "-D"
const formatNit = (value) => {
  let nit = value.trim();

  // Verificamos si el NIT tiene entre 1 y 9 dígitos (sin el dígito de verificación)
  const validBasePattern = /^\d{1,9}$/;

  if (validBasePattern.test(nit)) {
    // Si tiene entre 1 y 9 dígitos, le agregamos el dígito de verificación "0" de manera predeterminada
    return `${nit}-0`; // Aquí se puede ajustar para usar un dígito dinámico si se desea
  }

  // Si ya tiene un dígito de verificación, lo dejamos como está
  return nit;
};

const formCrearEmpresa = z.object({
  nit: z
    .string()
    .trim()
    .nonempty({ message: 'El NIT no puede estar vacío.' })
    .transform(formatNit)
    .refine((value) => /^\d{1,9}-\d{1}$/.test(value), {
      message: 'El NIT no tiene el formato válido (Ej: 123456789-0).',
    }),

  razonSocial: z
    .string()
    .nonempty({ message: 'La razón social no puede estar vacía.' })
    .min(3, { message: 'La razón social debe tener entre 3 y 25 caracteres.' })
    .max(25, {
      message: 'La razón social debe tener entre 3 y 25 caracteres.',
    }),
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
  direccion: z
    .string()
    .nonempty({ message: 'La dirección no puede estar vacía.' })
    .min(5, { message: 'La dirección debe tener entre 5 y 150 caracteres.' })
    .max(150, { message: 'La dirección debe tener entre 5 y 150 caracteres.' }),
});

const formEmpresaSearch = z.object({
  nit: z
    .string()
    .trim()
    .nonempty({ message: 'El NIT no puede estar vacío.' })
    .transform(formatNit)
    .refine((value) => /^[0-9]{3,15}-[A-Za-z0-9]$/.test(value), {
      message: 'El NIT no tiene el formato válido (Ej: 123456789-0).',
    }),
  razonSocial: z
    .string()
    .trim()
    .min(0, { message: 'La razón social no puede estar vacía.' })
    .optional(), // Hace que el campo sea opcional, pero si está, debe cumplir la validación
});

export { formCrearEmpresa, formEmpresaSearch };
