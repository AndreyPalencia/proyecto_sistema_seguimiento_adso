import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAlert } from '../../../context/AlertContext';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Stack,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';

import { useCrearFicha } from '../../../hook/fichas/useCrearFicha';

import InputField from '../../FormFields/InputField';
import SelectField from '../../FormFields/SelectField';
import DateFieldColombia from '../../FormFields/DateFieldColombia';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formCrearFicha } from '../../../schemas/formFichas';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {
  getTodayUtcFromBogota,
  getDatePlusMonthsFromBogota,
} from '../../../utils/utils';

const FormCrearFicha = ({ open, onClose, onSave }) => {
  const { idInstructor } = useParams();
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(formCrearFicha),
    defaultValues: {
      numeroFicha: '',
      nombrePrograma: '',
      terminoPrograma: '',
      estadoFicha: true,
      inicioEtapaProductiva: '',
      finEtapaProductiva: '',
      idInstructor: idInstructor,
    },
  });

  const { showAlert } = useAlert();
  const { fetchCrearFicha, loading } = useCrearFicha();

  const OnSubmit = async (formData) => {
    const success = await fetchCrearFicha(formData);

    if (success) {
      onSave();
      onClose();
    }
  };

  useEffect(() => {
    reset({
      numeroFicha: '',
      nombrePrograma: '',
      terminoPrograma: 'Tecnologo',
      estadoFicha: true,
      inicioEtapaProductiva: getTodayUtcFromBogota(),
      finEtapaProductiva: getDatePlusMonthsFromBogota(6),
      idInstructor,
    });
  }, [idInstructor, reset, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
            variant="title"
          >
            Crear Ficha
          </Typography>
          <Tooltip title="Cerrar formulario">
            <IconButton
              onClick={() => {
                onClose();
              }}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit(OnSubmit)}>
        <DialogContent>
          <Box sx={{ width: '100%' }}>
            {/* Columna 1 */}
            <Box sx={{ mb: 3 }}>
              <InputField
                name="numeroFicha"
                control={control}
                label="Número de Ficha"
                fullWidth
                size="medium"
                type="number"
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <SelectField
                name="terminoPrograma"
                control={control}
                label="Término del Programa"
                isArrayOptions
                fullWidth
                menuOptions={[
                  'Tecnologo',
                  'Tecnico',
                  'Auxiliar',
                  'Operario',
                  'Especializacion',
                ]}
              />
            </Box>

            {/* Columna 2 */}
            <Box sx={{ mb: 3 }}>
              <InputField
                name="nombrePrograma"
                control={control}
                label="Nombre del Programa"
                fullWidth
                size="medium"
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <DateFieldColombia
                name="inicioEtapaProductiva"
                control={control}
                label="Inicio etapa productiva"
                inputLabel
                fullWidth
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Columna 3 */}
            <Box sx={{ mb: 3 }}>
              <DateFieldColombia
                name="finEtapaProductiva"
                control={control}
                label="Fin etapa productiva"
                inputLabel={true}
                fullWidth
                sx={{ mt: 2 }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions >
          <Stack direction="row" spacing={2} sx={{ px: 2, pb: '15px' }}>
            <Button onClick={onClose} color="secondary" variant="outlined">
              Cancelar
            </Button>
            <Button type="submit" variant="contained" sx={{ ml: 2 }}>
              Guardar
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormCrearFicha;
