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

import { descargarReporteAprendicesVisitasNoRealizados } from '../../../services/ArchivosGenerados';

import DateFieldColombia from '../../FormFields/DateFieldColombia';
import CheckboxField from '../../FormFields/CheckboxField';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formReporteConFiltroOpcional } from '../../../schemas/formReporteVisitas';

import {
  getDatePlusMonthsFromBogota,
  getTodayUtcFromBogota,
} from '../../../utils/utils';

const FormAprendicesAgendamientosNoRealizados = ({ open, onClose }) => {
  const { idInstructor } = useParams();
  const { control, handleSubmit, reset, watch } = useForm({
    resolver: zodResolver(formReporteConFiltroOpcional),
    defaultValues: {
      fechaInicio: '',
      fechaFin: '',
      ignoreDateFilter: false,
    },
  });

  const { showAlert } = useAlert();

  const ignoreDateFilter = watch('ignoreDateFilter');

  const OnSubmit = async (formData) => {
    //console.log(formData);
    const datos = formData.ignoreDateFilter
      ? { ignoreDateFilter: true }
      : formData;
    try {
      await descargarReporteAprendicesVisitasNoRealizados(idInstructor, datos);
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
        fechaInicio: getDatePlusMonthsFromBogota(-2),
        fechaFin: getTodayUtcFromBogota(),
        ignoreDateFilter: false,
      });
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Generar Reporte de aprendices con agendamientos no realizados:
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(OnSubmit)}>
          <Box sx={{ mt: 4 }}>
            <Box sx={{ mb: 3 }}>
              <DateFieldColombia
                name="fechaInicio"
                label="Fecha de Inicio"
                control={control}
                required
                inputLabel
                disabled={ignoreDateFilter}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <DateFieldColombia
                name="fechaFin"
                label="Fecha de Fin"
                control={control}
                required
                inputLabel
                disabled={ignoreDateFilter}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <CheckboxField
                name="ignoreDateFilter"
                label="Todos agendamientos "
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

export default FormAprendicesAgendamientosNoRealizados;
