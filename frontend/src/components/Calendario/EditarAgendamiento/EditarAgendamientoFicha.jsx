//React & Context
import { useEffect } from 'react';

//MUI Componentes
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';

//Formularios e Inputs personalizados
import SelectField from '../../FormFields/SelectField';
import FormularioFechas from '../AgendamientoForm/FormularioFechas';
import FormularioReunion from '../AgendamientoForm/FormularioReunion';
import FormularioEstadoTipo from '../AgendamientoForm/FormularioEstadoTipo';

//Hooks personalizados (Fichas y Aprendices)
import { useFichaById } from '../../../hook/useFichaById';
import { useAprendicesByFichaId } from '../../../hook/useAprendicesByFichaId';
import { useEliminarAgendamientoAprendiz } from '../../../hook/agendamientos/useEliminarAgendamientoAprendiz';
import { useEditarAgendamientoAprendiz } from '../../../hook/agendamientos/useEditarAgendamientoAprendiz';

//Validaciones del formulario
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editarAgendamientoSchema } from '../../../schemas/formAgendamientoSchema';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

/**
 * Componete `EditarAgendamiento`
 *
 * Diálogo que permite editar o eliminar un agendamiento.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.idInstructor - ID del instructor actual.
 * @param {Object|null} props.agendamientoSeleccionado - Objeto con los datos del agendamiento a editar.
 * @param {Function} props.handleAgendamientoSeleccionado - Función para cerrar el diálogo o resetear selección.
 * @param {Function} props.actualizarEventoCalendario - Función para actualizar el calendario tras editar/eliminar.
 *
 * @returns {JSX.Element} El cuadro de diálogo para editar un agendamiento.
 */
const EditarAgendamientoFicha = ({
  idInstructor,
  idFicha,
  agendamientoSeleccionado,
  handleAgendamientoSeleccionado,
  actualizarEventoCalendario,
}) => {
  //Obtenemos las fichas disponibles usando el hook personalizado
  const { ficha, loading: loadingFicha } = useFichaById(idFicha);

  //Obtenemos aprendices relacionados a las fichas del instructor
  const {
    aprendices,
    loading: loadingAprendicesFicha,
    error: errorAprendicesFicha,
  } = useAprendicesByFichaId(idFicha);

  const { eliminarAgendamiento } = useEliminarAgendamientoAprendiz();

  const { editarAgendamiento } = useEditarAgendamientoAprendiz();

  //Configuración de react-hook-form con zod como validador, para el formulario de edición
  const { control, handleSubmit, watch, reset, getValues } = useForm({
    resolver: zodResolver(editarAgendamientoSchema),
    defaultValues: {
      idAgendamiento: '',
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

  //Observar en tiempo real el valor de ficha seleccionada (para cargar aprendices)

  const tipoVisita = watch('tipoVisita');

  /**
   * Actualiza un agendamiento en la base de datos.
   *
   * @param {string} idAgendamiento - ID del agendamiento a actualizar
   * @param {Object} formData - Datos del formulario (excluye idFicha)
   */
  /**
   * Actualiza un agendamiento en la base de datos.
   *
   * @param {string} idAgendamiento - ID del agendamiento a actualizar
   * @param {Object} formData - Datos del formulario (excluye idFicha)
   */
  const handleUpdateAgendamiento = async (idAgendamiento, formData) => {
    await editarAgendamiento(idAgendamiento, formData);
    await actualizarEventoCalendario(idAgendamiento, formData);
  };

  /**
   * Elimina un agendamiento en la base de datos.
   *
   * @param {string} idAgendamiento - ID del agendamiento a eliminar
   */
  const handleDeleteAgendamiento = async (idAgendamiento) => {
    await eliminarAgendamiento(idAgendamiento, () =>
      actualizarEventoCalendario(idAgendamiento)
    );
  };

  /**
   * Envía el formulario dependiendo de la acción del botón (Guardar o Eliminar).
   *
   * @param {Object} data - Datos del formulario validados por react-hook-form
   * @param {Event} event - Evento de envío del formulario
   */
  const onSubmit = (data) => {
    const { idFicha, idAgendamiento, ...formData } = data;
    handleUpdateAgendamiento(idAgendamiento, formData);
  };

  /**
   * Carga los datos del agendamiento seleccionado en el formulario cuando cambia.
   * Si la ficha no existe entre las disponibles, el campo queda vacío.
   */
  useEffect(() => {
    if (agendamientoSeleccionado) {
      const idFicha = agendamientoSeleccionado.idFicha;

      const aprendizSeleccionado = aprendices?.find(
        (aprendiz) =>
          aprendiz.idFichaAprendiz === agendamientoSeleccionado?.idFichaAprendiz
      );

      const idFichaAprendiz = aprendizSeleccionado?.idFichaAprendiz || '';

      reset({
        idAgendamiento: agendamientoSeleccionado.idAgendamiento || '',
        idFicha: idFicha,
        idFichaAprendiz: idFichaAprendiz,
        idInstructor: idInstructor || '',
        herramientaReunion: agendamientoSeleccionado.herramientaReunion || '',
        enlaceReunion: agendamientoSeleccionado.enlaceReunion || '',
        fechaInicio: agendamientoSeleccionado.fechaInicio || '',
        fechaFin: agendamientoSeleccionado.fechaFin || '',
        estadoVisita: agendamientoSeleccionado.estadoVisita || 'Pendiente',
        tipoVisita: agendamientoSeleccionado.tipoVisita || 'Presencial',
        numeroVisita: agendamientoSeleccionado.numeroVisita || '1',
      });
    }
  }, [agendamientoSeleccionado, reset, idInstructor, aprendices]);

  useEffect(() => {
    if (tipoVisita !== 'Virtual') {
      // Reset fields that are only relevant for Virtual meetings
      reset({
        ...getValues(), // Keep the other values unchanged
        herramientaReunion: '', // Clear tool for Virtual meetings
        enlaceReunion: '', // Clear link for Virtual meetings
      });
    }
  }, [tipoVisita, reset, getValues]);

  return (
    <Dialog
      open={Boolean(agendamientoSeleccionado)}
      onClose={() => {
        handleAgendamientoSeleccionado(null);
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
            variant="title"
          >
            Editar Visita
          </Typography>
          <Tooltip title="Cerrar formulario">
            <IconButton
              onClick={() => {
                handleAgendamientoSeleccionado();
              }}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ width: 800, maxWidth: '100%' }}>
        <form
          onSubmit={handleSubmit((data, event) => {
            onSubmit(data, event);
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
          />
          <SelectField
            select
            label="Aprendiz"
            name="idFichaAprendiz"
            control={control}
            menuOptions={aprendices || []}
            valueKey="idFichaAprendiz"
            labelKey="nombre"
            disabled={!idFicha}
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
            required={true}
            disabled={false}
          />
          <FormularioEstadoTipo
            control={control}
            required={true}
            disabled={false}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleAgendamientoSeleccionado(null)}
            >
              Cerrar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              name="Guardar"
            >
              Actualizar
            </Button>
            <Button
              type="button"
              variant="contained"
              color="error"
              onClick={() =>
                handleDeleteAgendamiento(getValues('idAgendamiento'))
              }
            >
              Eliminar
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarAgendamientoFicha;
