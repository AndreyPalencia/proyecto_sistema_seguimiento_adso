import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAgendamientoByRol } from '../../services/Agendamientos';
import { convertirEnFechaColombiana } from '../../utils/utils';
import { useAlert } from '../../context/AlertContext';

const useAgendamientosAprendiz = ({
  idFicha,
  idInstructor = null,
  idFichaAprendiz,
}) => {
  const [agendamientos, setAgendamientos] = useState([]);
  const [loading, setLoading] = useState(false);

  //const [agendamientosRealizados, setAgendamientosRealizados] = useState([]);

  // const ESTADO_FILTRO = 'Realizada';
  // const MAXIMO_VISITAS = 3;

  const { showAlert } = useAlert();

  const fetchAgendamientos = async () => {
    setLoading(true);
    try {
      const filtros = {};
      if (idInstructor) filtros.idInstructor = idInstructor;
      if (idFichaAprendiz) filtros.idFichaAprendiz = idFichaAprendiz;

      const data = await getAgendamientoByRol(filtros, idFicha);

      const agendamientos = data.map((agendamiento) => ({
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

      setAgendamientos(agendamientos);
      // setAgendamientosRealizados(
      //   data.filter((ag) => ag.estadoVisita === ESTADO_FILTRO)
      // );
    } catch (error) {
      console.error(
        'Error al obtener los agendamientos relacionados al aprendiz.',
        error?.message
      );

      if (error.status === 404) {
        setAgendamientos([]);
      } else {
        showAlert({
          message: `Error al obtener los agendamientos aprendiz.`,
          severity: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idFicha && (idInstructor || idFichaAprendiz)) {
      fetchAgendamientos();
    }
  }, [idFicha, idInstructor, idFichaAprendiz, showAlert]);

  // const datosFormulario = useMemo(() => {
  //   const numerosVisitasOcupados = agendamientos
  //     .filter((ag) => ag.estadoVisita === ESTADO_FILTRO)
  //     .map((ag) => ag.numeroVisita)
  //     .filter((n) => typeof n === 'number')
  //     .sort((a, b) => a - b);

  //   // Encuentra el número más bajo que NO está en la lista ocupada
  //   let numeroDisponible = null;
  //   for (let i = 1; i <= MAXIMO_VISITAS; i++) {
  //     if (!numerosVisitasOcupados.includes(i)) {
  //       numeroDisponible = i;
  //       break;
  //     }
  //   }
  //   return {
  //     total: agendamientosRealizados.length,
  //     numerosOcupados: numerosVisitasOcupados,
  //     numeroSiguiente: numeroDisponible,
  //     max: MAXIMO_VISITAS,
  //   };
  // }, [agendamientos]);

  return {
    agendamientos,
    loading,
    refetchAgendamientos: fetchAgendamientos,
  };
};

export { useAgendamientosAprendiz };
