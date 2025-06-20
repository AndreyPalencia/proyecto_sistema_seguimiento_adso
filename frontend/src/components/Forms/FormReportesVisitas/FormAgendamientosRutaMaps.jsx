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

import { descargarReporteRutaAgendamientosMaps } from '../../../services/ArchivosGenerados';

import DateFieldColombia from '../../FormFields/DateFieldColombia';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formBusquedaPorFecha } from '../../../schemas/formReporteVisitas';

import { getTodayUtcFromBogota } from '../../../utils/utils';

const FormAgendamientosRutaMaps = ({ open, onClose }) => {
  const { idInstructor, idInstructorAdmin } = useParams();

  let idInstructorConsultas = idInstructor || idInstructorAdmin;
  const { control, handleSubmit, reset, watch } = useForm({
    resolver: zodResolver(formBusquedaPorFecha),
    defaultValues: {
      fechaBusqueda: '',
    },
  });

  const { showAlert } = useAlert();

  const OnSubmit = async (formData) => {
    try {
      await descargarReporteRutaAgendamientosMaps(
        idInstructorConsultas,
        formData
      );
      onClose();
    } catch (error) {
      console.error(`Ocurrio un errror en la descarga del reporte:`, error);
      showAlert({
        message: `Ocurrio un errror en la descarga del reporte: ${error.message}`,
        variant: 'standard',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (open) {
      reset({
        fechaBusqueda: getTodayUtcFromBogota(),
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Generar Reporte ruta de agendamientos:</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(OnSubmit)}>
          <Box sx={{ mt: 4 }}>
            <Box sx={{ mb: 3 }}>
              <DateFieldColombia
                name="fechaBusqueda"
                label="Seleccionar Fecha"
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

export default FormAgendamientosRutaMaps;
