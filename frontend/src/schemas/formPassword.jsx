import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener un mínimo de 8 caracteres')
  .regex(/[0-9]/, 'La contraseña debe contener al menos un número.')
  .regex(
    /[^A-Za-z0-9]/,
    'La contraseña debe contener al menos un caracter especial.'
  );

const baseSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: z
    .string()
    .min(8, 'La contraseña debe tener un mínimo de 8 caracteres'),
});

const formCambiarPassword = baseSchema.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  }
);

// ✅ Ahora puedes hacer .omit sobre baseSchema (no sobre formCambiarPassword)
export const formRecuperarPassword = baseSchema
  .omit({ currentPassword: true })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export default formCambiarPassword;
