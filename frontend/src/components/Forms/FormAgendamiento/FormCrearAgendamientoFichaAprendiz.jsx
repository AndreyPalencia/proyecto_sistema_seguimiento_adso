//React & Context
import { useAlert } from '../../../context/AlertContext';

//MUI Componentes
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Stack,
  DialogActions,
} from '@mui/material';

//Formularios e Inputs personalizados
import FormularioFechas from '../../Calendario/AgendamientoForm/FormularioFechas';
import FormularioReunion from '../../Calendario/AgendamientoForm/FormularioReunion';
import FormularioEstadoTipo from '../../Calendario/AgendamientoForm/FormularioEstadoTipo';

import { useNotificacionesDefault } from '../../../hook/notificaciones/useNotfiicacionesDefault';

import { convertirEnFechaColombiana } from '../../../utils/utils';

//Validaciones del formulario
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { crearAgendamientoSchema } from '../../../schemas/formAgendamientoSchema';
import { createAgendamiento } from '../../../services/Agendamientos';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const FormCrearAgendamientoFichaAprendiz = ({
  ficha,
  aprendizInfo,
  idFichaAprendiz,
  idInstructor,
  onAgendamientoCrear,
  open,
  onClose,
}) => {
  const today = new Date();
  today.setUTCDate(today.getUTCDate() - 1);
  const baseDateStr = today.toISOString().slice(0, 10); // "2025-05-02"

  const fechaInicioFin = {
    start: `${baseDateStr}T12:00:00Z`,
    end: `${baseDateStr}T12:30:00Z`,
  };

  const { showAlert } = useAlert();

  const { notificarAgendamientoVisita } = useNotificacionesDefault();

  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(crearAgendamientoSchema),
    defaultValues: {
      idFicha: ficha?.idFicha,
      idFichaAprendiz: idFichaAprendiz,
      idInstructor: idInstructor,
      herramientaReunion: '',
      enlaceReunion: '',
      fechaInicio: fechaInicioFin.start || '',
      fechaFin: fechaInicioFin.end || '',
      estadoVisita: 'Solicitud',
      tipoVisita: 'Presencial',
      numeroVisita: '1',
    },
  });

  const tipoVisita = watch('tipoVisita');

  const handleCreateAgendamiento = async (formData) => {
    try {
      const agendamiento = await createAgendamiento(formData);
      showAlert({
        message: 'Agendamiento creado con éxito',
        severity: 'success',
        variant: 'standard',
      });
      const agendamientoFormateado = {
        idAgendamiento: agendamiento.idAgendamiento,
        numeroVisita: agendamiento.numeroVisita,
        estadoVisita: agendamiento.estadoVisita,
        tipoVisita: agendamiento.tipoVisita,
        fechaInicio: convertirEnFechaColombiana(agendamiento.fechaInicio),
        fechaFin: convertirEnFechaColombiana(agendamiento.fechaFin),
        herramientaReunion: agendamiento.herramientaReunion,
        enlaceReunion: agendamiento.enlaceReunion,
        idFichaAprendiz: agendamiento.idFichaAprendiz,
        idInstructor: agendamiento.idInstructor,
        ...agendamiento,
      };
      onAgendamientoCrear(agendamientoFormateado);
    } catch (error) {
      console.log('Error al crear el agendamiento:', error);
      showAlert({
        title: 'Error',
        message: `Error al crear el agendamiento: ${error.message}`,
        severity: 'error',
        variant: 'filled',
      });
    }
  };

  const onSubmit = async (data) => {
    const { idFicha, ...formData } = data;
    await handleCreateAgendamiento(formData);
    await notificarAgendamientoVisita(idInstructor, formData, ficha );
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
            variant="title"
          >
            Editar Agendamiento
          </Typography>
          <Tooltip title="Cerrar formulario">
            <IconButton onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      {console.log({
        aprendizInfo,
        ficha,
      })}
      <DialogContent sx={{ width: 800, maxWidth: '100%' }}>
        <form
          onSubmit={handleSubmit(onSubmit, (error) => {
            console.log(error);
          })}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            padding: '10px 0',
            paddingBottom: '0',
          }}
        >
          <TextField
            label="Ficha"
            name="idFicha"
            value={`${ficha?.numeroFicha} - ${ficha?.nombrePrograma} `}
            disabled
          />
          <TextField
            label="Aprendiz"
            name="idFichaAprendiz"
            value={`${aprendizInfo?.nombre} ${aprendizInfo?.apellido}`}
            disabled
          />
          {tipoVisita === 'Virtual' && (
            <FormularioReunion
              control={control}
              required={false}
              disabled={false}
            />
          )}
          <FormularioFechas control={control} required disabled={false} />
          <FormularioEstadoTipo control={control} required isAprendiz />

          <DialogActions sx={{ padding: 0 }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ pt: 2, width: '100%' }}
            >
              <Button variant="outlined" color="secondary" onClick={onClose}>
                Cerrar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Agendar
              </Button>
            </Stack>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormCrearAgendamientoFichaAprendiz;
