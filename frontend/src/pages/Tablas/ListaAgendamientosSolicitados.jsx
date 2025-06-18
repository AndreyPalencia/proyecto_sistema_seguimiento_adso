import { useEffect, useMemo, useState } from 'react';
import { useActionsButtonsContext } from '../../context/ActionsButtonsContext';
import { TablaLista } from '../../components/Tabla/Tabla';

import { useEditarAgendamientoAprendiz } from '../../hook/agendamientos/useEditarAgendamientoAprendiz';

import { convertirEnFechaColombiana } from '../../utils/utils';

import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import EditarAgendamiento from '../../components/Calendario/EditarAgendamiento/EditarAgendamiento';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

const ListaAgendamientosSolicitados = ({
  eventosSolicitados,
  idInstructor,
  agendamientoSeleccionado,
  handleAgendamientoSeleccionado,
  actualizarEventoCalendario,
}) => {
  const { updateActionsButtons } = useActionsButtonsContext();

  const { editarAgendamiento } = useEditarAgendamientoAprendiz();

  const getAgendamientoById = (id) =>
    eventosSolicitados.find((agen) => agen.idAgendamiento === id);

  const handleEditarAgendamientoClick = (idAgendamiento) => {
    const seleccionado = getAgendamientoById(idAgendamiento);
    if (!seleccionado) return;
    handleAgendamientoSeleccionado(seleccionado);
  };

  const handlSolicitudAAgendamiento = async (idAgendamiento) => {
    const agendamiento = getAgendamientoById(idAgendamiento);
    const formData = { ...agendamiento, estadoVisita: 'Programada' };
    await editarAgendamiento(idAgendamiento, formData);
    await actualizarEventoCalendario(idAgendamiento, formData);
  };

  const agendamientos = useMemo(() => {
    return eventosSolicitados.map((agendamiento) => ({
      idAgendamiento: agendamiento.idAgendamiento,
      numeroVisita: agendamiento.numeroVisita,
      estadoVisita: agendamiento.estadoVisita,
      tipoVisita: agendamiento.tipoVisita,
      fechaInicio: convertirEnFechaColombiana(agendamiento.fechaInicio),
      fechaFin: convertirEnFechaColombiana(agendamiento.fechaFin),
      herramientaReunion: agendamiento.herramientaReunion,
      enlaceReunion: agendamiento.enlaceReunion,
      idFichaAprendiz: agendamiento.idFichaAprendiz,
      idInstructor: agendamiento.idInstructor,
    }));
  }, [eventosSolicitados]);

  const botonesAgendamiento = [
    {
      icon: DrawOutlinedIcon,
      color: '#29737D',
      position: 'center',
      action: handleEditarAgendamientoClick,
      tooltip: 'Editar',
    },
    {
      icon: CheckCircleOutlineOutlinedIcon,
      color: '#39A900',
      position: 'center',
      action: handlSolicitudAAgendamiento,
      tooltip: 'Aceptar confirmación',
    },
  ];

  useEffect(() => {
    if (agendamientos?.length) {
      updateActionsButtons(botonesAgendamiento);
    }
  }, [agendamientos]);

  return (
    <>
      <TablaLista
        key={`${agendamientos.length}`}
        data={agendamientos}
        dataException={[
          'idFichaAprendiz',
          'idFicha',
          'herramientaReunion',
          'enlaceReunion',
          'idInstructor',
          'idAgendamiento',
        ]}
        selectedValue={'idAgendamiento'}
        header={[
          'Numero Visita',
          'Estado Visita',
          'Tipo de Visita',
          'Fecha Inicio',
          'Fecha Fin',
        ]}
      />

      {agendamientoSeleccionado && (
        <EditarAgendamiento
          idInstructor={idInstructor}
          agendamientoSeleccionado={agendamientoSeleccionado}
          handleAgendamientoSeleccionado={handleAgendamientoSeleccionado}
          actualizarEventoCalendario={actualizarEventoCalendario}
        />
      )}
    </>
  );
};

export default ListaAgendamientosSolicitados;
