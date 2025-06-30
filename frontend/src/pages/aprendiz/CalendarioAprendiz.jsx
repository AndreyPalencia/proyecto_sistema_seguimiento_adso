// CalendarioAprendiz.jsx
import { useParams } from 'react-router-dom';
import { useLayout } from '../../context/LayoutContext';
import { useAuth } from '../../context/AuthContext';

import { Box } from '@mui/material';

import { useAprendizByRuta } from '../../hook/useAprendizByRuta';
import { useAgendamientoCalendar } from '../../hook/agendamientos/useAgendamientoCalendario';

import CalendarioBase from '../../components/Calendario/CalendarioBase';
import CrearAgendamientoFichaAprendiz from '../../components/Calendario/CrearAgendamiento/CrearAgendamientoFichaAprendiz';
import VerAgendamiento from '../../components/Calendario/VerAgendamiento/VerAgendamiento';
import EditarAgendamientoFicha from '../../components/Calendario/EditarAgendamiento/EditarAgendamientoFicha';
import EditarAgendamiento from '../../components/Calendario/EditarAgendamiento/EditarAgendamiento';
/**
 * CalendarioAprendiz
 *
 * Muestra un calendario de agendamientos de un aprendiz por ficha.
 *
 * @param {string|number} idAprendiz - ID del aprendiz
 * @param {string|number} idFicha - ID de la ficha
 */
const CalendarioAprendiz = () => {
  const { idFicha } = useParams();

  const { contentHeight } = useLayout();

  const { roleUsuario } = useAuth();

  const isAdmin = roleUsuario === 'admin';

  const { aprendizInfo, datosCargados } = useAprendizByRuta();

  const idFichaAprendiz = aprendizInfo?.idFichaAprendiz;
  const idInstructor = aprendizInfo?.idInstructor;

  const {
    calendarioRef,
    formatEventosConDestacado,
    fechaSeleccionada,
    setFechaSeleccionada,
    handleDateSelect,
    handleEventClick,
    agregarEvento,
    agendamientoSeleccionado,
    setAgendamientoSeleccionado,
    actualizarEvento,
  } = useAgendamientoCalendar({ idInstructor });

  const idFichaAprendizAge = agendamientoSeleccionado?.idFichaAprendiz;

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
            eventos={formatEventosConDestacado(idFichaAprendiz)}
            onSelect={handleDateSelect}
            onEventClick={handleEventClick}
            height={contentHeight - 50}
          />
        </Box>

        {fechaSeleccionada && datosCargados && aprendizInfo && (
          <CrearAgendamientoFichaAprendiz
            aprendizInfo={aprendizInfo}
            idFicha={idFicha}
            idFichaAprendiz={idFichaAprendiz}
            idInstructor={idInstructor}
            fechaSeleccionada={fechaSeleccionada}
            handleFechaSeleccionada={setFechaSeleccionada}
            agregarEventosCalendario={agregarEvento}
          />
        )}

        {!isAdmin &&
          agendamientoSeleccionado &&
          idFichaAprendizAge == idFichaAprendiz && (
            <VerAgendamiento
              aprendizInfo={aprendizInfo}
              idFicha={idFicha}
              agendamientoSeleccionado={agendamientoSeleccionado}
              handleAgendamientoSeleccionado={setAgendamientoSeleccionado}
            />
          )}

        {isAdmin && agendamientoSeleccionado && (
          <EditarAgendamiento
            idInstructor={idInstructor}
            agendamientoSeleccionado={agendamientoSeleccionado}
            handleAgendamientoSeleccionado={setAgendamientoSeleccionado}
            actualizarEventoCalendario={actualizarEvento}
          />
        )}
      </Box>
    </>
  );
};

export default CalendarioAprendiz;
