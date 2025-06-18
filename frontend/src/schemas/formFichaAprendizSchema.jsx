import { z } from 'zod';

const alternativas = [
  'Contrato de Aprendizaje',
  'Pasantía',
  'Proyecto Productivo',
  'Monitoría',
];

const formCrearFichaAprendiz = z.object({
  idUsuario: z.coerce.number().min(1, 'id_usuario es requerida'),
  idFicha: z.coerce.number().min(1, 'id_ficha es requerida'),
  idEmpresa: z.coerce.number().min(1, 'id_empresa es requerida'),
  alternativa: z.enum(alternativas),
  cargoEmpresa: z
    .string()
    .min(2, 'Cargo empresa es requerida')
    .max(
      40,
      'El nombre del cargo empresa puede tener maximo de 40 caracteres.'
    ),
  jefeInmediato: z
    .string()
    .min(2, 'Jefe inmediato es requerida')
    .max(
      45,
      'El nombre del jefe inmediato puede tener maximo de 45 caracteres.'
    ),
  correoElectronicoJefe: z
    .string()
    .nonempty({ message: 'El correo electrónico no puede estar vacío.' })
    .email({ message: 'El correo electrónico no tiene un formato válido.' }),

  telefonoJefe: z.coerce
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
  cargoJefe: z
    .string()
    .min(1, 'Cargo del jefe es requerido')
    .max(45, 'El cargo del jefo puede tener maximo de 40t caracteres.'),
});

export { formCrearFichaAprendiz, alternativas };
