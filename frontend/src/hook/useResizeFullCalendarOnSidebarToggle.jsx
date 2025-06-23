// hooks/useResizeFullCalendarOnSidebarToggle.js
import { useEffect } from 'react';
import { useSidebar } from '../context/SidebarContext';

export function useResizeFullCalendarOnSidebarToggle(calendarRef, delay = 450) {
  const { isSidebarVisible } = useSidebar();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (calendarRef?.current) {
        calendarRef.current.getApi().updateSize();
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [isSidebarVisible]);
}
