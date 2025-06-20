// hooks/useAgendamientoCalendar.js

import { useEffect, useRef, useState, useMemo } from 'react';
import { useAlert } from '../../context/AlertContext';
import { getAgendamientoByRol } from '../../services/Agendamientos';

/**
 * Custom hook that encapsulates the full logic for FullCalendar calendar management.
 *
 * Features:
 * - Fetch and manage event data from the backend using `getAgendamientoByRol`.
 * - Handle date selection and event click interactions.
 * - Maintain internal state for selected date and selected event.
 * - Format events for display in FullCalendar.
 *
 * @param {Object} paramsFetch - Parameters used to fetch agendamientos (e.g., { idInstructor }, or { idAprendiz, idFicha }).
 * @returns {Object} All logic needed to drive a FullCalendar component.
 */
const useAgendamientoCalendar = (paramsFetch) => {
  // Estado para almacenar los eventos que se muestran en el calendario
  const [eventos, setEventos] = useState([]);

  // Estado para controlar la fecha seleccionada cuando el usuario hace click en una fecha vacía
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  // Estado para controlar qué evento ha sido seleccionado
  const [agendamientoSeleccionado, setAgendamientoSeleccionado] =
    useState(null);

  // Referencia al componente FullCalendar para posibles usos avanzados
  const calendarioRef = useRef();

  // Acceso al sistema de alertas del contexto
  const { showAlert } = useAlert();

  /**
   * Lógica para cargar los eventos desde el backend usando los parámetros pasados.
   */
  const cargarEventos = async () => {
    try {
      // Llamamos al servicio y pasamos los parámetros según tipo de calendario
      const data = await getAgendamientoByRol(
        paramsFetch,
        paramsFetch?.idFicha
      );

      // Mapeamos para incluir un ID único que requiere FullCalendar
      const eventosConId = data.
      map((evento) => ({
        ...evento,
        id: evento.idAgendamiento,
      }));

      setEventos(eventosConId);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      if (error?.status === 404) {
        showAlert({
          message: 'No se encontraron eventos sobre esta ficha.',
          severity: 'warning',
          variant: 'standard',
        });
      } else {
        showAlert({
          message: 'Error al cargar eventos del calendario.',
          severity: 'error',
        });
      }
    }
  };

  /**
   * Ejecutar carga de eventos cuando cambien los parámetros de consulta.
   */
  useEffect(() => {
    cargarEventos();
  }, [JSON.stringify(paramsFetch)]); // Re-ejecuta si cambia cualquier campo del objeto

  /**
   * Colores personalizados según estado de la visita.
   */
  const obtenerColorEvento = (estado) => {
    const colores = {
      Programada: '#50E5F9',
      Pendiente: '#FDC300',
      Realizada: '#39A900',
      Cancelada: 'red',
      Reprogramada: 'orange',
    };
    return colores[estado] || 'gray';
  };

  /**
   * Formatear eventos para mostrar correctamente en FullCalendar.
   */
  const eventosFormateados = useMemo(() => {
    return (eventos || []).map((evento) => ({
      id: evento.idAgendamiento,
      title: evento.estadoVisita || 'Sin título',
      start: new Date(evento.fechaInicio),
      end: new Date(evento.fechaFin),
      color: obtenerColorEvento(evento.estadoVisita),
      allDay: false,
    }));
  }, [eventos]);

  /**
   * Formats eventos for FullCalendar and highlights the ones that belong to the specified aprendiz.
   *
   * @param {string|number|null} idFichaAprendiz - Optional ID of the aprendiz to highlight.
   * @returns {Array} Formatted eventos with color highlighting.
   */
  const formatEventosConDestacado = (idFichaAprendiz = null) => {
    return (eventos || []).map((evento) => {
      const esDestacado =
        idFichaAprendiz &&
        String(evento.idFichaAprendiz) === String(idFichaAprendiz);

      return {
        id: evento.idAgendamiento,
        title: evento.estadoVisita || 'Sin título',
        start: new Date(evento.fechaInicio),
        end: new Date(evento.fechaFin),
        allDay: false,
        color: esDestacado
          ? '#FFEE58'
          : obtenerColorEvento(evento.estadoVisita),
        borderColor: !esDestacado ? '#000000' : undefined,
        textColor: esDestacado ? '#000000' : undefined,
        classNames: esDestacado ? ['evento-destacado'] : [],
      };
    });
  };

  /**
   * Manejar selección de una fecha vacía.
   */
  const handleDateSelect = (info) => {
    const tipoVista = info.view?.type;

    let fechaInicioFin;

    if (tipoVista === 'dayGridMonth' || tipoVista === 'listWeek') {
      // Vista tipo MES o LISTA → usar hora fija
      fechaInicioFin = {
        start: `${info.startStr}T12:00:00`,
        end: `${info.startStr}T12:30:00`,
      };
    } else {
      // Vista tipo SEMANA u otra que seleccione rango → usar hora real
      fechaInicioFin = {
        start: info.startStr,
        end: info.endStr,
      };
    }

    //console.log(fechaInicioFin, 'handleDateSelect');

    setFechaSeleccionada(fechaInicioFin);
    setAgendamientoSeleccionado(null);
  };

  /**
   * Manejar clic sobre un evento para seleccionarlo.
   */
  const handleEventClick = (info) => {
    const eventId = info.event.id;
    const seleccionado = eventos.find(
      (evento) => String(evento.idAgendamiento) === String(eventId)
    );

    if (seleccionado) {
      setAgendamientoSeleccionado(seleccionado);
      setFechaSeleccionada(null);
    } else {
      showAlert({
        message: 'El evento no fue encontrado.',
        severity: 'error',
      });
    }
  };

  /**
   * Agrega un nuevo evento al calendario (usado después de crear).
   */
  const agregarEvento = (nuevoEvento) => {
    const newEvento = { ...nuevoEvento, id: nuevoEvento.idAgendamiento };
    setEventos((prev) => [...prev, newEvento]);
  };

  /**
   * Actualiza un evento existente o elimina si se pasa un ID.
   */
  const actualizarEvento = (idAgendamiento, valor) => {
    if (typeof valor === 'object' && valor !== null) {
      // Update the event with new properties
      setEventos((prev) =>
        prev.map((e) =>
          e.idAgendamiento === idAgendamiento ? { ...e, ...valor } : e
        )
      );
      setAgendamientoSeleccionado(null);
      return;
    }

    if (idAgendamiento) {
      // Delete the event by filtering it out
      setEventos((prev) =>
        prev.filter((e) => e.idAgendamiento !== idAgendamiento)
      );
      setAgendamientoSeleccionado(null);
      return;
    }

    // Optionally return early if you don't want to reset selection
    console.warn('Unexpected type for valor:', valor);
    // Clear the selected event after update or delete
    setAgendamientoSeleccionado(null);
    return;
  };

  /**
   * Search for an event by a specific property and value.
   * @param {string} propiedad - The name of the property to search by (e.g., 'idAgendamiento', 'estadoVisita').
   * @param {*} valor - The value to match against.
   * @returns {Object|null} The found event, or null if not found.
   */
  const buscarEventoPorPropiedad = (propiedad, valor) => {
    return eventos.filter((evento) => evento[propiedad] === valor) || null;
  };

  // Retornamos toda la lógica lista para usar en el componente
  return {
    calendarioRef,
    eventosFormateados,
    formatEventosConDestacado,
    fechaSeleccionada,
    agendamientoSeleccionado,
    setFechaSeleccionada,
    setAgendamientoSeleccionado,
    handleDateSelect,
    handleEventClick,
    agregarEvento,
    actualizarEvento,
    buscarEventoPorPropiedad,
  };
};

export { useAgendamientoCalendar };
