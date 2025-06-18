import { useEffect } from 'react';
import { useActionsButtonsContext } from '../../../context/ActionsButtonsContext';

import { TablaLista } from '../../../components/Tabla/Tabla';

import { useAgendamientosAprendiz } from '../../../hook/agendamientos/useAgendamientosAprendiz';

const AgendamientosAprendiz = ({
  idFichaAprendiz,
  idFicha,
  nuevoAgendamiento,
}) => {
  const { agendamientos, loading, refetchAgendamientos } = useAgendamientosAprendiz({
    idFicha,
    idFichaAprendiz,
  });

  const { updateActionsButtons } = useActionsButtonsContext();

  const botonesAgendamiento = [];

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
      </>
    )
  );
};

export default AgendamientosAprendiz;
