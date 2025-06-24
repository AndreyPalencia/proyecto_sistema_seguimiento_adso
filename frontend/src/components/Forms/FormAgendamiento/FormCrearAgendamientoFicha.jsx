import { useAuth } from '../../../context/AuthContext';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  DialogActions,
  Stack,
  Box,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';

//Formularios e Inputs personalizados
import FormularioFechas from '../../Calendario/AgendamientoForm/FormularioFechas';
import FormularioReunion from '../../Calendario/AgendamientoForm/FormularioReunion';
import FormularioEstadoTipo from '../../Calendario/AgendamientoForm/FormularioEstadoTipo';
import FullScreenLoader from '../../Feedback/FullScreenLoader';

import { useCrearAgendamiento } from '../../../hook/agendamientos/useCrearAgendamiento';
import { useNotificacionesDefault } from '../../../hook/notificaciones/useNotfiicacionesDefault';
import { getUtcSlotFromOffset } from '../../../utils/utils';

//Validaciones del formulario
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { crearAgendamientoSchema } from '../../../schemas/formAgendamientoSchema';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const FormCrearAgendamientoFicha = ({
  ficha,
  aprendiz,
  idFichaAprendiz,
  idInstructor,
  onAgendamientoCrear,
  open,
  onClose,
}) => {
  const { roleUsuario } = useAuth();

  const fechas = getUtcSlotFromOffset({daysAgo: 0});

  const { notificarAgendamientoVisita } = useNotificacionesDefault();

  const { fetchCrearAgendamiento, loading } = useCrearAgendamiento();

  const isAprendiz = roleUsuario === 'aprendiz' 

  const estado = isAprendiz ? 'Solicitud' : 'Programada';

  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(crearAgendamientoSchema),
    defaultValues: {
      idFicha: ficha?.idFicha,
      idFichaAprendiz: idFichaAprendiz,
      idInstructor: idInstructor,
      herramientaReunion: '',
      enlaceReunion: '',
      fechaInicio: fechas.start || '',
      fechaFin: fechas.end || '',
      estadoVisita: estado,
      tipoVisita: 'Presencial',
      numeroVisita: '1',
    },
  });

  const tipoVisita = watch('tipoVisita');

  const onSubmit = async (data) => {
    const { idFicha, ...formData } = data;

    try {
      const agendamiento = await fetchCrearAgendamiento(data);

      if (agendamiento) {
        onAgendamientoCrear?.(agendamiento); // usar el objeto retornado

        if (roleUsuario === 'aprendiz' || roleUsuario === 'admin') {
          await notificarAgendamientoVisita(idInstructor, formData, ficha);
        }

        onClose?.(); // cerrar modal
      }
    } catch (error) {
      console.error(
        'Error al crear agendamiento o enviar notificación:',
        error
      );
    }
  };
  
  return (
    <>
      <FullScreenLoader open={loading} />

      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
              variant="title"
            >
              Crear Agendamiento
            </Typography>
            <Tooltip title="Cerrar formulario">
              <IconButton onClick={onClose}>
                <CloseOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ width: 800, maxWidth: '100%' }}>
          <form
            onSubmit={handleSubmit(onSubmit, (error) => {
              console.log(error);
            })}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              padding: '10px 15px',
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
              value={`${aprendiz?.nombre} ${aprendiz?.apellido}`}
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
            <FormularioEstadoTipo control={control} required isAprendiz={isAprendiz} />
            <DialogActions sx={{ px: 0 }}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => onClose()}
                >
                  Cerrar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  name="Guardar"
                >
                  Agendar
                </Button>
              </Stack>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormCrearAgendamientoFicha;
