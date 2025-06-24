//MUI Componentes
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  TextField,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { crearAgendamientoSchema } from '../../../schemas/formAgendamientoSchema';
import { useAuth } from '../../../context/AuthContext';

//Formularios e Inputs personalizados
import FormularioFechas from '../AgendamientoForm/FormularioFechas';
import FormularioReunion from '../AgendamientoForm/FormularioReunion';
import FormularioEstadoTipo from '../AgendamientoForm/FormularioEstadoTipo';
import FullScreenLoader from '../../Feedback/FullScreenLoader';

import { useFichaById } from '../../../hook/useFichaById';
import { useNotificacionesDefault } from '../../../hook/notificaciones/useNotfiicacionesDefault';
import { useCrearAgendamiento } from '../../../hook/agendamientos/useCrearAgendamiento';

//Validaciones del formulario
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

/**
 * Componente `CrearAgendamiento`
 *
 * Diálogo que permite agendar/crear una nueva visita (agendamiento).
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.idInstructor - ID del instructor actual.
 * @param {Object|null} props.fechaSeleccionada - Objeto con la fecha de inicio y fin seleccionadas.
 * @param {Function} props.handleFechaSeleccionada - Función para cerrar el diálogo o limpiar la selección.
 * @param {Function} props.agregarEventosCalendario - Función para agregar el evento al calendario tras crearlo.
 * @returns {JSX.Element} Componente de tipo diálogo con formulario para crear agendamiento.
 *
 * @returns {JSX.Element} El cuadro de diálogo para crear un agendamiento.
 */

const CrearAgendamientoFichaAprendiz = ({
  aprendizInfo,
  idFicha,
  idFichaAprendiz,
  idInstructor,
  fechaSeleccionada,
  handleFechaSeleccionada,
  agregarEventosCalendario,
}) => {
  const { fetchCrearAgendamiento, loading } = useCrearAgendamiento();
  const { notificarAgendamientoVisita } = useNotificacionesDefault();
  const { roleUsuario } = useAuth();
  const isAdmin = roleUsuario === 'admin';


  const { ficha, loading: loadingFicha } = useFichaById(idFicha);

  const nombreAprendiz = `${aprendizInfo?.nombre} ${aprendizInfo?.apellido}`;

  //Configuración de react-hook-form con zod como validador, para el formulario de creación
  const { control, handleSubmit, watch } = useForm({
    resolver: zodResolver(crearAgendamientoSchema),
    defaultValues: {
      idFicha: idFicha,
      idFichaAprendiz: idFichaAprendiz || '',
      idInstructor: idInstructor || '',
      herramientaReunion: '',
      enlaceReunion: '',
      fechaInicio: fechaSeleccionada ? fechaSeleccionada.start : '',
      fechaFin: fechaSeleccionada ? fechaSeleccionada.end : '',
      estadoVisita: 'Solicitud',
      tipoVisita: 'Presencial',
      numeroVisita: '1',
    },
  });

  //Observar en tiempo real el valor de ficha seleccionada (para cargar aprendices)
  const tipoVisita = watch('tipoVisita');

  /**
   * Función ´para crear un agendamiento en la base de datos.
   *
   * @param {Object} formData - Datos del formulario que serán enviados al backend
   */

  /**
   * Función que maneja el envío del formulario de agendamiento.
   * Extrae los datos y llama a la función que realiza la petición para crear el agendamiento.
   *
   * @param {Object} data - Datos del formulario validados por react-hook-form
   */
  const onSubmit = async (data) => {
    const { idFicha, ...formData } = data;
    const agendamiento = await fetchCrearAgendamiento(formData); // Llama a la función para crear el agendamiento
    if (!loading) {
      const { idInstructor } = agendamiento;
      agregarEventosCalendario(agendamiento);
      await notificarAgendamientoVisita(idInstructor, agendamiento, ficha);
      handleFechaSeleccionada();
    }
  };

  return (
    <>
      <FullScreenLoader open={loading} />
      <Dialog
        open={Boolean(fechaSeleccionada)}
        onClose={() => {
          handleFechaSeleccionada();
        }}
      >
        <DialogTitle>
          {' '}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
              variant="title"
            >
              Agendar Visita
            </Typography>
            <Tooltip title="Cerrar formulario">
              <IconButton
                onClick={() => {
                  handleFechaSeleccionada();
                }}
              >
                <CloseOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ width: 800, maxWidth: '100%' }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
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
              value={nombreAprendiz}
              disabled
            />
            {tipoVisita === 'Virtual' && (
              <FormularioReunion
                control={control}
                required={false}
                disabled={false}
              />
            )}
            <FormularioFechas
              control={control}
              required={false}
              disabled={false}
            />
            <FormularioEstadoTipo
              control={control}
              required={false}
              disabled={false}
              isAprendiz={!isAdmin}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  handleFechaSeleccionada();
                }}
              >
                Cerrar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Guardar
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CrearAgendamientoFichaAprendiz;
