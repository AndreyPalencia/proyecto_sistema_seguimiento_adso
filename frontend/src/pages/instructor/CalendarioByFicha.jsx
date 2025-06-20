import { useParams } from 'react-router-dom';
import { useLayout } from '../../context/LayoutContext';

import { Box } from '@mui/material';

import { useAgendamientoCalendar } from '../../hook/agendamientos/useAgendamientoCalendario';

import CalendarioBase from '../../components/Calendario/CalendarioBase';
import CrearAgendamientoFicha from '../../components/Calendario/CrearAgendamiento/CrearAgendamientoFicha';
import EditarAgendamientoFicha from '../../components/Calendario/EditarAgendamiento/EditarAgendamientoFicha';

const CalendarioByFicha = () => {
  const { idInstructor, idFicha } = useParams();
  const { contentHeight } = useLayout();

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
  } = useAgendamientoCalendar({ idInstructor, idFicha });

  return (
    <>
      <Box
        sx={{
          // border: 'solid red',
          display: 'flex',
          justifyContent: 'space-around',
          flexDirection: 'column',
          height: contentHeight - 40, // <-- set height dynamically here
          gap: '5px',
          mt: '20px',
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <CalendarioBase
            calendarRef={calendarioRef}
            eventos={eventosFormateados}
            onSelect={handleDateSelect}
            onEventClick={handleEventClick}
            height={contentHeight - 50}
          />
        </Box>
        {fechaSeleccionada && (
          <CrearAgendamientoFicha
            idInstructor={idInstructor}
            idFicha={idFicha}
            fechaSeleccionada={fechaSeleccionada}
            handleFechaSeleccionada={setFechaSeleccionada}
            agregarEventosCalendario={agregarEvento}
          />
        )}

        {agendamientoSeleccionado && (
          <EditarAgendamientoFicha
            idInstructor={idInstructor}
            idFicha={idFicha}
            agendamientoSeleccionado={agendamientoSeleccionado}
            handleAgendamientoSeleccionado={setAgendamientoSeleccionado}
            actualizarEventoCalendario={actualizarEvento}
          />
        )}
      </Box>
    </>
  );
};

export default CalendarioByFicha;
