import { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../context/AlertContext';

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

import { crearBitacora } from '../../../services/Bitacoras';

import InputField from '../../FormFields/InputField';
import DateTimeFieldColombia from '../../FormFields/DateTimeFieldColombia';
import TextAreaField from '../../FormFields/TextAreaField';
import UploadFileField from '../../FormFields/UploadFileField';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { formCrearBitacora } from '../../../schemas/formBitacoraSchema';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const FormCrearBitacora = ({
  open,
  onClose,
  idFichaAprendiz,
  datosFormulario,
  onCrearBitacora,
}) => {
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(formCrearBitacora),
    defaultValues: {
      idFichaAprendiz: idFichaAprendiz,
      observacion: '',
      numeroBitacora: 1,
      estadoBitacora: false,
      fechaUltimaActualizacion: ' ',
      archivo: null,
    },
  });

  const { showAlert } = useAlert();

  const { roleUsuario } = useAuth();

  const isAprendiz = roleUsuario === 'aprendiz';
  const isInstructor = roleUsuario === 'instructor';

  const handleCrearBitacora = async (formData) => {
    try {
      let dataToSend;

      if (formData.archivo instanceof File) {
        dataToSend = new FormData();
        for (const key in formData) {
          if (formData[key] !== undefined && formData[key] !== null) {
            dataToSend.append(key, formData[key]);
          }
        }
      } else {
        dataToSend = { ...formData };
      }
      const bitacora = await crearBitacora(dataToSend);
      onCrearBitacora(bitacora);
      showAlert({
        message: 'Se ha creado exitosamente un bitacora.',
        severity: 'success',
        variant: 'standard',
      });
    } catch (error) {
      console.error('Error al crear una bitácora.', error);
      showAlert({
        message: `Error al crear una bitácora. ${error.message} `,
        severity: 'error',
      });
    }
  };

  const OnSubmit = async (formData) => {
    //console.log({ formData });
    await handleCrearBitacora(formData);
    onClose();
    reset();
  };

  useEffect(() => {
    const currentDate = new Date();

    reset({
      fechaUltimaActualizacion: currentDate,
      numeroBitacora: datosFormulario?.numeroSiguiente || 1,
      estadoBitacora: false,
      idFichaAprendiz: idFichaAprendiz,
    });
  }, [idFichaAprendiz, datosFormulario, reset, open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
            variant="title"
          >
            Crear bitácora
          </Typography>
          <Tooltip title="Cerrar formulario">
            <IconButton onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit(OnSubmit)}>
        <DialogContent>
          {datosFormulario?.total >= datosFormulario.max ? (
            <Box color="" fontWeight="">
              Ya se han creado 12 bitácoras. No puedes agregar más.
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{ mt: 1, mb: 2 }}
            >
              <InputField
                name="numeroBitacora"
                label="Número de Bitácora"
                control={control}
                disabled
              />

              {(!isAprendiz && !isInstructor) && (
                <TextAreaField
                  name="observacion"
                  label="Observación"
                  rows={4}
                  control={control}
                />
              )}

              <UploadFileField
                name="archivo"
                label="Nueva bitácora (archivo)"
                control={control}
              />

              <DateTimeFieldColombia
                name="fechaUltimaActualizacion"
                label="Fecha de última actualización"
                control={control}
                required={true}
                inputLabel={true}
                disabled={true}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end" // Alinea ambos botones a la derecha
            sx={{ px: 2, pb: 2 }}
          >
            <Button onClick={onClose} color="secondary" variant="outlined">
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={datosFormulario?.total >= datosFormulario.max}
            >
              Agregar
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormCrearBitacora;
