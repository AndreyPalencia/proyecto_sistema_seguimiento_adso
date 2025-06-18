import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';

import TextAreaField from '../../FormFields/TextAreaField';
import CheckboxField from '../../FormFields/CheckboxField';
import DateFieldColombia from '../../FormFields/DateFieldColombia';

import { useCrearObservacionAprendiz } from '../../../hook/observaciones/useCrearObservacionAprendiz';

import { zodResolver } from '@hookform/resolvers/zod';
import formObservacion from '../../../schemas/formObservacion';

import { getTodayUtcFromBogota } from '../../../utils/utils';
/**
 * Diálogo para crear una nueva observación.
 *
 * @param {Object} props
 * @param {boolean} props.open - Si el diálogo está abierto.
 * @param {Function} props.onClose - Función para cerrar el diálogo.
 * @param {number} props.idFichaAprendiz - ID de la ficha del aprendiz.
 */
const FormCrearObservacion = ({
  idFichaAprendiz,
  open,
  onClose,
  refetchObservaciones,
}) => {
  const { loading, fetchCrearObservacion } = useCrearObservacionAprendiz();

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    resolver: zodResolver(formObservacion),
    defaultValues: {
      idFichaAprendiz: null,
      observacion: '',
      mostrarObservacion: false,
      fechaUltimaActualizacion: getTodayUtcFromBogota(), // YYYY-MM-DD
    },
  });

  const estado = watch('mostrarObservacion');

  const onSubmit = async (formData) => {
    await fetchCrearObservacion(formData);
    if (!loading) {
      await refetchObservaciones();
      onClose();
      reset();
    }
  };

  useEffect(() => {
    if (idFichaAprendiz) {
      setValue('idFichaAprendiz', idFichaAprendiz);
    }
  }, [idFichaAprendiz, setValue]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Crear Observación</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
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
          <Stack
            justifyContent="space-between"
            spacing={2}
            sx={{ px: 2, pb: '18px' }}
            direction="row"
          >
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

export default FormCrearObservacion;
