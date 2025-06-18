import { useAgendamientosAprendiz } from '../../hook/agendamientos/useAgendamientosAprendiz';
import { TablaLista } from '../Tabla/Tabla';

const ListadoVisitasSolicitadas = () => {
  const { agendamientos, loading, refetchAgendamientos } =
    useAgendamientosAprendiz({
      idFicha,
      idFichaAprendiz,
    });

  useEffect(() => {
    if (!loading && agendamientos?.length) {
      updateActionsButtons(botonesAgendamiento);
    }
  }, [loading, agendamientos]);
  return (
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
        'Numero Visita',
        'Estado Visita',
        'Tipo de Visita',
        'Fecha Inicio',
        'Fecha Fin',
        'Herramienta Reunion',
        'Enlace Reunion',
      ]}
    />
  );
};

export default ListadoVisitasSolicitadas;
