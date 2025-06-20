import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLayout } from '../../context/LayoutContext';

import { Box, IconButton, Tooltip } from '@mui/material';

import { useAgendamientoCalendar } from '../../hook/agendamientos/useAgendamientoCalendario';

import CalendarioBase from '../../components/Calendario/CalendarioBase';
import CrearAgendamiento from '../../components/Calendario/CrearAgendamiento/CrearAgendamiento';
import EditarAgendamiento from '../../components/Calendario/EditarAgendamiento/EditarAgendamiento';
import {
  BoxFilter,
  ButtonFilter,
} from '../../components/Tabla/TablaController/GeneralFilterButtons/GeneralFilterButtons.style';
import FormAprendicesSinVisitas from '../../components/Forms/FormReportesVisitas/FormAprendicesSinVisitas';
import ListaAgendamientosSolicitados from '../Tablas/ListaAgendamientosSolicitados';
import FormAprendicesAgendamientosNoRealizados from '../../components/Forms/FormReportesVisitas/FormAprendicesAgendamientosNoRealizados';
import FormAgendamientosRutaMaps from '../../components/Forms/FormReportesVisitas/FormAgendamientosRutaMaps';

import { MdOutlineFreeCancellation } from 'react-icons/md';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

/**
 * `CalendarioFichas`
 *
 * Componente que muestra el calendario de agendamiento de un instructor específico.
 * Obtiene el `idInstructor` de los parámetros de la URL y pasa este dato al componente
 * `CalendarioAgendamiento` para que se muestre el calendario correspondiente.
 *
 * @returns {JSX.Element} Retorna el calendario de agendamiento del instructor.
 */

const CalendarioFichas = () => {
  const { idInstructor, idInstructorAdmin } = useParams();

  let idInstructorConsultas = idInstructor || idInstructorAdmin;
  const { contentHeight } = useLayout();

  const [estadoSelecionado, setEstadoSelecionado] = useState('Calendario');

  const handleButtonClick = (event, optionKey) => {
    setEstadoSelecionado(optionKey);
  };

  const [openAprendicesSinVisita, setAprendicesSinVisita] = useState(false);
  const handleReporteAprendicesSinVisita = () => {
    setAprendicesSinVisita((prev) => !prev);
  };

  const [
    openAprendicesAgendamientosNoRealizados,
    setAprendicesAgendamientosNoRealizados,
  ] = useState(false);
  const handleReporteAprendicesAgendamientosNoRealizados = () => {
    setAprendicesAgendamientosNoRealizados((prev) => !prev);
  };

  const [openAgendamientosMaps, setAgendamientosMaps] = useState(false);
  const handleReporteAgendamientosMaps = () => {
    setAgendamientosMaps((prev) => !prev);
  };

  const {
    calendarioRef,
    eventosFormateados,
    fechaSeleccionada,
    agendamientoSeleccionado,
    setFechaSeleccionada,
    setAgendamientoSeleccionado,
    handleDateSelect,
    handleEventClick,
    agregarEvento,
    actualizarEvento,
    buscarEventoPorPropiedad,
  } = useAgendamientoCalendar({ idInstructorConsultas });

  const eventosSolicitados = buscarEventoPorPropiedad(
    'estadoVisita',
    'Solicitud'
  );

  return (
    <Box
      sx={{
        // border: 'solid red',
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'column',
        height:
          contentHeight -
          `${estadoSelecionado === 'Listado de Solicitudes' ? 120 : 20}`, // <-- set height dynamically here
        gap: '5px',
        mt: '10px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <BoxFilter>
            {['Calendario', 'Listado de Solicitudes'].map((key) => {
              return (
                <ButtonFilter
                  key={key}
                  isSelected={estadoSelecionado === key ? true : false} // Pasamos el estado de selección
                  name={'value'} // El nombre de cada botón
                  onClick={(event) => handleButtonClick(event, key)} // Pasar el evento completo
                >
                  {key} {/* Aquí muestra la clave del botón */}
                </ButtonFilter>
              );
            })}
          </BoxFilter>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Tooltip title="Generar reporte aprendices sin visitas">
              <IconButton
                aria-label="Generar reporte aprendices sin visitas"
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pt: '9px',
                }}
                onClick={() => handleReporteAprendicesSinVisita()}
              >
                <EventBusyOutlinedIcon
                  sx={{ fontSize: 24, color: '#39A900' }}
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="Generar reporte agendamientos pasados">
              <IconButton
                aria-label="Generar reporte agendamientos pasados"
                onClick={() =>
                  handleReporteAprendicesAgendamientosNoRealizados()
                }
              >
                <MdOutlineFreeCancellation
                  style={{ fontSize: 24, color: '#39A900' }}
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="Generar reporte de ruta">
              <IconButton
                aria-label="Generar reporte de ruta"
                onClick={() => handleReporteAgendamientosMaps()}
              >
                <MapOutlinedIcon sx={{ fontSize: 24, color: '#39A900' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {estadoSelecionado === 'Calendario' && (
          <CalendarioBase
            calendarRef={calendarioRef}
            eventos={eventosFormateados}
            onSelect={handleDateSelect}
            onEventClick={handleEventClick}
            height={contentHeight - 110}
          />
        )}

        {estadoSelecionado === 'Listado de Solicitudes' && (
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <ListaAgendamientosSolicitados
              eventosSolicitados={eventosSolicitados}
              idInstructor={idInstructorConsultas}
              agendamientoSeleccionado={agendamientoSeleccionado}
              handleAgendamientoSeleccionado={setAgendamientoSeleccionado}
              actualizarEventoCalendario={actualizarEvento}
            />
          </Box>
        )}
      </Box>

      {/* {console.log({ eventosFormateados })} */}

      {fechaSeleccionada && (
        <CrearAgendamiento
          idInstructor={idInstructorConsultas}
          fechaSeleccionada={fechaSeleccionada}
          handleFechaSeleccionada={setFechaSeleccionada}
          agregarEventosCalendario={agregarEvento}
        />
      )}

      {agendamientoSeleccionado && (
        <EditarAgendamiento
          idInstructor={idInstructorConsultas}
          agendamientoSeleccionado={agendamientoSeleccionado}
          handleAgendamientoSeleccionado={setAgendamientoSeleccionado}
          actualizarEventoCalendario={actualizarEvento}
        />
      )}

      {
        <FormAprendicesSinVisitas
          onClose={handleReporteAprendicesSinVisita}
          open={openAprendicesSinVisita}
        />
      }
      {
        <FormAprendicesAgendamientosNoRealizados
          onClose={handleReporteAprendicesAgendamientosNoRealizados}
          open={openAprendicesAgendamientosNoRealizados}
        />
      }

      {
        <FormAgendamientosRutaMaps
          onClose={handleReporteAgendamientosMaps}
          open={openAgendamientosMaps}
        />
      }
    </Box>
  );
};

export default CalendarioFichas;
