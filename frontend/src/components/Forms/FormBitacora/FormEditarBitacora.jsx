import { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';

import DateTimeFieldColombia from '../../FormFields/DateTimeFieldColombia';
import TextAreaField from '../../FormFields/TextAreaField';
import UploadFileField from '../../FormFields/UploadFileField';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formEditarBitacora } from '../../../schemas/formBitacoraSchema';
import InputField from '../../FormFields/InputField';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const FormEditarBitacora = ({
  open,
  onClose,
  idFichaAprendiz,
  bitacora,
  onEditarBitacora,
}) => {
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(formEditarBitacora),
    defaultValues: {
      idBitacora: '',
      idFichaAprendiz: idFichaAprendiz || '',
      observacion: '',
      numeroBitacora: 1,
      estadoBitacora: false,
      fechaUltimaActualizacion: '',
      archivo: null,
    },
  });

  const { roleUsuario } = useAuth();

  const isAprendiz = roleUsuario === 'aprendiz';
  const isInstructor = roleUsuario === 'instructor';

  const OnSubmit = async (formData) => {
    const { idBitacora } = bitacora;
    onEditarBitacora(idBitacora, formData);
    onClose();
  };

  useEffect(() => {
    const { idBitacora, numeroBitacora, observacion, estadoBitacora } =
      bitacora;

    reset({
      idBitacora: idBitacora,
      idFichaAprendiz: idFichaAprendiz,
      numeroBitacora: numeroBitacora,
      observacion: observacion || '',
      estadoBitacora: estadoBitacora,
      fechaUltimaActualizacion: new Date().toISOString(),
      //archivo: null, // <= Asegúrate de declarar el campo
    });
  }, [idFichaAprendiz, reset, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
            variant="title"
          >
            Editar bitácora
          </Typography>
          <Tooltip title="Cerrar formulario">
            <IconButton onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <form
        onSubmit={handleSubmit(OnSubmit, (error) => {
          console.log(error);
        })}
      >
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{ mt: 1, mb: 2 }}
          >
            <InputField
              name="numeroBitacora"
              label="Número de Bitácora"
              isArrayOptions={true}
              control={control}
              disabled
            />

            {!isAprendiz && (
              <TextAreaField
                name="observacion"
                label="Observación"
                rows={4}
                control={control}
              />
            )}

            {!isInstructor && (
              <UploadFileField
                name="archivo"
                label="Nueva bitácora (archivo)"
                control={control}
              />
            )}

            <DateTimeFieldColombia
              name="fechaUltimaActualizacion"
              label="Fecha de última actualización"
              control={control}
              required={true}
              inputLabel={true}
              disabled={true}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" spacing={2} sx={{ px: 2, pb: 2 }}>
            <Button onClick={onClose} color="secondary" variant="outlined">
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Guardar
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormEditarBitacora;
