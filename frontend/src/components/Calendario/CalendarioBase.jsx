import { memo, useState } from 'react';

import { Box } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridWeek from '@fullcalendar/timegrid';
import listWeek from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';

const CalendarioBase = ({
  calendarRef,
  eventos,
  onSelect,
  onEventClick,
  height,
}) => {
  const [currentView, setCurrentView] = useState('dayGridMonth');

  return (
    <Box sx={{ height: height ?? 'auto', overflow: 'auto' }}>
      <FullCalendar
        height="100%"
        locale={{ ...esLocale, allDayText: 'Todo el día' }}
        ref={calendarRef}
        initialView="dayGridMonth"
        plugins={[dayGridPlugin, timeGridWeek, listWeek, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: `dayGridMonth,timeGridWeek,listWeek`,
        }}
        buttonText={{
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          list: 'Lista',
        }}
        events={eventos}
        selectable={true}
        select={onSelect}
        eventClick={onEventClick}
        eventMouseEnter={(info) => {
          info.el.style.cursor = 'pointer';
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }}
        datesSet={(arg) => {
          setCurrentView(arg.view.type);
        }}
      />
    </Box>
  );
};

export default memo(CalendarioBase);
