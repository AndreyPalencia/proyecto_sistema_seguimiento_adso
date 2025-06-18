import { useEffect, useState } from 'react';
import { useActionsButtonsContext } from '../../../context/ActionsButtonsContext';

import { TablaLista } from '../../../components/Tabla/Tabla';

import { useAgendamientosAprendiz } from '../../../hook/agendamientos/useAgendamientosAprendiz';
import { useEditarAgendamientoAprendiz } from '../../../hook/agendamientos/useEditarAgendamientoAprendiz';
import { useEliminarAgendamientoAprendiz } from '../../../hook/agendamientos/useEliminarAgendamientoAprendiz';

import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FormEditarAgendamientoFicha from '../../../components/Forms/FormAgendamiento/FormEditarAgendamientoFicha';

const AgendamientosInstructor = ({
  idFichaAprendiz,
  idFicha,
  aprendiz,
  ficha,
  nuevoAgendamiento,
}) => {
  const [openEditarAgendamiento, setEditarAgendamiento] = useState(false);

  const [agendamientoSeleccionado, setAgendamientoSeleccionado] =
    useState(null);

  const { agendamientos, loading, refetchAgendamientos } =
    useAgendamientosAprendiz({
      idFicha,
      idFichaAprendiz,
    });

  const { editarAgendamiento } = useEditarAgendamientoAprendiz();

  const { eliminarAgendamiento } = useEliminarAgendamientoAprendiz();

  const { updateActionsButtons } = useActionsButtonsContext();

  const getAgendamientoById = (id) =>
    agendamientos.find((agen) => agen.idAgendamiento === id);

  const handleEditarAgendamiento = () => setEditarAgendamiento((prev) => !prev);

  const handleEditarAgendamientoClick = (idAgendamiento) => {
    const seleccionado = getAgendamientoById(idAgendamiento);
    if (!seleccionado) return;
    setAgendamientoSeleccionado(seleccionado);
    handleEditarAgendamiento();
  };

  const handleEditarAgendamientoDialog = async (
    idAgendamiento,
    agendamientoEditado
  ) => {
    await editarAgendamiento(idAgendamiento, agendamientoEditado);
    await refetchAgendamientos();
  };

  const handleEliminarAgendamiento = async (idAgendamiento) => {
    await eliminarAgendamiento(idAgendamiento, refetchAgendamientos);
  };

  const botonesAgendamiento = [
    {
      icon: DrawOutlinedIcon,
      color: ' #29737D',
      position: 'center',
      action: handleEditarAgendamientoClick,
      tooltip: 'Editar',
    },
    {
      icon: DeleteOutlineOutlinedIcon,
      color: ' #EC221F',
      position: 'center',
      action: handleEliminarAgendamiento,
      tooltip: 'Eliminar',
    },
  ];

  useEffect(() => {
    if (!loading && agendamientos?.length) {
      updateActionsButtons(botonesAgendamiento);
    }
  }, [loading, agendamientos]);

  useEffect(() => {
    if (nuevoAgendamiento) {
      refetchAgendamientos();
    }
  }, [nuevoAgendamiento]);

  return (
    !loading && (
      <>
        <TablaLista
          key={`${idFichaAprendiz}-${agendamientos.length}`}
          data={agendamientos || []}
          dataException={[
            'idFichaAprendiz',
            'idInstructor',
            'idFicha',
            'idAgendamiento',
          ]}
          selectedValue={'idAgendamiento'}
          header={[
            'Número Visita',
            'Estado Visita',
            'Tipo de Visita',
            'Fecha Inicio',
            'Fecha Fin',
            'Herramienta Reunión',
            'Enlace Reunión',
          ]}
        />

        {openEditarAgendamiento && agendamientoSeleccionado && (
          <FormEditarAgendamientoFicha
            ficha={ficha}
            aprendiz={aprendiz}
            agendamientoSeleccionado={agendamientoSeleccionado}
            onAgendamientoActualizado={handleEditarAgendamientoDialog}
            onClose={() => {
              handleEditarAgendamiento();
              setAgendamientoSeleccionado(null);
            }}
          />
        )}
      </>
    )
  );
};

export default AgendamientosInstructor;
