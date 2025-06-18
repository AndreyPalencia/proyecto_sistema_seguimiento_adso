import { useForm } from 'react-hook-form';
import {
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import InputField from '../../../components/FormFields/InputField';

const FormCrearEmpresa = ({ open, onClose, onSave }) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      razonSocial: '',
      nit: '',
      direccion: '',
      telefono: '',
      correoElectronico: '',
    },
  });

  const onSubmit = async (data) => {
    await onSave(data);
    onClose(); // Close dialog after successful submission
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>Crear Empresa</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid   sx={{ width: '100%' }}>
              <InputField
                name="razonSocial"
                label="Nombre de la empresa"
                control={control}
                required
              />
            </Grid>

            <Grid   sx={{ width: '100%' }}>
              <InputField
                name="nit"
                label="NIT de la empresa"
                control={control}
                required
              />
            </Grid>

            <Grid   sx={{ width: '100%' }}>
              <InputField
                name="direccion"
                label="Dirección de la empresa"
                control={control}
                required
              />
            </Grid>

            <Grid   sx={{ width: '100%' }}>
              <InputField
                name="telefono"
                label="Teléfono de la empresa"
                control={control}
                type="number"
                required
              />
            </Grid>

            <Grid   sx={{ width: '100%' }}>
              <InputField
                name="correoElectronico"
                label="Correo electrónico de la empresa"
                control={control}
                type="email"
                required
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormCrearEmpresa;
