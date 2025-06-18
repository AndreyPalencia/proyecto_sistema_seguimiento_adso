import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';

import { useCambiarPassword } from '../../../hook/auth/useCambiarPassword';

import PasswordField from '../../FormFields/PasswordField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import formCambiarPassword from '../../../schemas/formPassword'; // Nuevo schema de validación

/**
 * Diálogo para cambiar la contraseña del usuario.
 *
 * @param {Object} props
 * @param {boolean} props.open - Si el diálogo está abierto.
 * @param {Function} props.onClose - Función para cerrar el diálogo.
 */
const FormCambiarPassword = ({ open, onClose }) => {
  const { loading, changePassword } = useCambiarPassword();

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(formCambiarPassword),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (formData) => {
    console.log('pass', formData);
    const { confirmPassword, ...rest } = formData;
    await changePassword(rest);
    if (loading) {
      reset();
      onClose();
    }
  };

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cambiar Contraseña</DialogTitle>

      <form
        onSubmit={handleSubmit(onSubmit, (errors) => console.error(errors))}
      >
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <PasswordField
            name="currentPassword"
            label="Contraseña actual"
            control={control}
            required
            variant="outlined"
          />
          <PasswordField
            name="newPassword"
            label="Nueva contraseña"
            control={control}
            required
          />
          <PasswordField
            name="confirmPassword"
            label="Confirmar nueva contraseña"
            control={control}
            required
          />
        </DialogContent>

        <DialogActions>
          <Stack direction="row" spacing={2} sx={{ p: 2 }}>
            <Button onClick={onClose} color="secondary" variant="outlined">
              Cancelar
            </Button>
            <Button variant="contained" color="primary" type="submit">
              Guardar
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormCambiarPassword;
