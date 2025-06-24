//React & Context
import { useEffect } from 'react';
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
} from '@mui/material';

//Formularios e Inputs personalizados
import FormularioFechas from '../../Calendario/AgendamientoForm/FormularioFechas';
import FormularioReunion from '../../Calendario/AgendamientoForm/FormularioReunion';
import FormularioEstadoTipo from '../../Calendario/AgendamientoForm/FormularioEstadoTipo';

//Validaciones del formulario
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editarAgendamientoSchema } from '../../../schemas/formAgendamientoSchema';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const FormEditarAgendamientoFicha = ({
  ficha,
  aprendiz,
  agendamientoSeleccionado,
  onAgendamientoActualizado,
  onClose,
}) => {
  const { idInstructor, idAgendamiento } = agendamientoSeleccionado;
  //console.log(agendamientoSeleccionado, idAgendamiento)

  const { control, handleSubmit, watch, reset, getValues, setValue } = useForm({
    resolver: zodResolver(editarAgendamientoSchema),
    defaultValues: {
      idAgendamiento: idAgendamiento,
      idFicha: '',
      idFichaAprendiz: '',
      idInstructor: idInstructor || '',
      herramientaReunion: '',
      enlaceReunion: '',
      fechaInicio: '',
      fechaFin: '',
      estadoVisita: 'Pendiente',
      tipoVisita: 'Presencial',
      numeroVisita: '1',
    },
  });

  const tipoVisita = watch('tipoVisita');

  const onSubmit = (data) => {
    const { idFicha, idAgendamiento, ...formData } = data;
    onAgendamientoActualizado(idAgendamiento, formData);
    onClose();
  };

  useEffect(() => {
    if (agendamientoSeleccionado && ficha && aprendiz) {
      console.log({ agendamientoSeleccionado });
      reset({
        ...getValues(),
        idFicha: ficha.idFicha,
        idFichaAprendiz: agendamientoSeleccionado.idFichaAprendiz || '',
        idInstructor: agendamientoSeleccionado.idInstructor || '',
        herramientaReunion: agendamientoSeleccionado.herramientaReunion || '',
        enlaceReunion: agendamientoSeleccionado.enlaceReunion || '',
        fechaInicio:
          new Date(agendamientoSeleccionado.fechaInicio).toISOString() || '',
        fechaFin:
          new Date(agendamientoSeleccionado.fechaFin).toISOString() || '',
        estadoVisita: agendamientoSeleccionado.estadoVisita || 'Pendiente',
        tipoVisita: agendamientoSeleccionado.tipoVisita || 'Presencial',
        numeroVisita: agendamientoSeleccionado.numeroVisita || '1',
      });
    }
  }, [agendamientoSeleccionado, ficha, aprendiz, reset]);

  // useEffect(() => {
  //   if (tipoVisita !== 'virtual') {
  //     // setValue('herramientaReunion', '');
  //     // setValue('enlaceReunion', '');
  //   }
  // }, [tipoVisita, setValue]);

  return (
    <Dialog open={Boolean(agendamientoSeleccionado)} onClose={onClose}>
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
          <FormularioEstadoTipo control={control} required disabled={false} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
              Guardar
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormEditarAgendamientoFicha;
