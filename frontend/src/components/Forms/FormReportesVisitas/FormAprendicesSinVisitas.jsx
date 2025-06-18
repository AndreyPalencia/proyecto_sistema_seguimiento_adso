import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAlert } from '../../../context/AlertContext';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  DialogTitle,
} from '@mui/material';

import { descargarReporteAprendicesSinVisitas } from '../../../services/ArchivosGenerados';

import DateFieldColombia from '../../FormFields/DateFieldColombia';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import formReporteVisitas from '../../../schemas/formReporteVisitas'; // Nuevo schema de validación

import {
  getDatePlusMonthsFromBogota,
  getTodayUtcFromBogota,
} from '../../../utils/utils';

const FormAprendicesSinVisitas = ({ open, onClose }) => {
  const { idInstructor } = useParams();
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(formReporteVisitas),
    defaultValues: {
      fechaInicio: '',
      fechaFin: '',
      ignoreDateFilter: false,
    },
  });

  const { showAlert } = useAlert();
  const OnSubmit = async (formData) => {
    console.log(formData);
    try {
      await descargarReporteAprendicesSinVisitas(idInstructor, formData);
    } catch (error) {
      console.error(`Ocurrio un errror en la descarga del reporte: ${error}`);
      showAlert({
        message: `Ocurrio un errror en la descarga del reporte: ${error.message}`,
        variant: 'standard',
        severity: 'error',
      });
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      reset({
        fechaInicio: getDatePlusMonthsFromBogota(-2),
        fechaFin: getTodayUtcFromBogota(),
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Generar Reporte de aprendices sin visitas agendadas:
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(OnSubmit)}>
          <Box sx={{ mt: 4 }}>
            <Box sx={{ mb: 3 }}>
              <DateFieldColombia
                name="fechaInicio"
                label="Fecha más reciente"
                control={control}
                required
                inputLabel
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <DateFieldColombia
                name="fechaFin"
                label="Fecha hacia atrás (límite)"
                control={control}
                required
                inputLabel
              />
            </Box>
          </Box>
          <DialogActions sx={{ padding: 0 }}>
            <Stack direction="row" spacing={2}>
              <Button onClick={onClose} color="secondary" variant="outlined">
                Cancelar
              </Button>
              <Button color="primary" variant="contained" type="submit">
                Generar
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormAprendicesSinVisitas;
