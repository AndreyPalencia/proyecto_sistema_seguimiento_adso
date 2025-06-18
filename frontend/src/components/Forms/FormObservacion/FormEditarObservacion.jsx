import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

import { useEffect } from 'react';

import TextAreaField from '../../FormFields/TextAreaField';
import CheckboxField from '../../FormFields/CheckboxField';
import DateFieldColombia from '../../FormFields/DateFieldColombia';

import { useEditarObservacionAprendiz } from '../../../hook/observaciones/useEditarObservacionAprendiz';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import formObservacion from '../../../schemas/formObservacion';

import { getTodayUtcFromBogota } from '../../../utils/utils';

const FormEditarObservacion = ({
  idObservacion,
  open,
  onClose,
  observacion,
  refetchObservaciones,
}) => {
  const { loading, fetchEditarObservacion } = useEditarObservacionAprendiz();
  const { control, handleSubmit, reset, watch } = useForm({
    resolver: zodResolver(formObservacion),
    defaultValues: {
      observacion: '',
      mostrarObservacion: false,
      fechaUltimaActualizacion: '',
    },
  });

  useEffect(() => {
    if (open && observacion) {
      reset({
        observacion: observacion.observacion,
        mostrarObservacion: observacion.mostrarObservacion,
        fechaUltimaActualizacion: getTodayUtcFromBogota(),
      });
    }
  }, [open, observacion, reset]);

  const onSubmit = async (formData) => {
    await fetchEditarObservacion(idObservacion, formData);
    if (!loading) {
      await refetchObservaciones();
    }
  };

  const onError = (errors) => {
    console.error('Errores de validación:', errors);
  };

  const estado = watch('mostrarObservacion');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Observación</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <TextAreaField
            name="observacion"
            label="Observación"
            control={control}
            required={true}
            minRows={4}
          />
          <CheckboxField
            name="mostrarObservacion"
            label={
              estado ? 'Visible para aprendiz' : 'Invisible para al aprendiz'
            }
            control={control}
            required={true}
          />
          <DateFieldColombia
            name="fechaUltimaActualizacion"
            label="Fecha de última actualización"
            control={control}
            required={true}
            inputLabel={true}
            disabled={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Actualizar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormEditarObservacion;
