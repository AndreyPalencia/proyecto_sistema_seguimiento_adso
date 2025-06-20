import { useState, useEffect, useMemo } from 'react';
import { getFichasByIdInstructorAndState } from '../services/Fichas.js';

/**
 * Hook personalizado para obtener y transformar las fichas activas de un instructor.
 *
 * Este hook se encarga de obtener las fichas activas asociadas a un instructor
 * a partir de su ID y el estado de la ficha. Además, transforma los datos de
 * las fichas para tener un formato más adecuado para la interfaz de usuario.
 *
 * @param {Object} props - Propiedades para configurar el hook.
 * @param {string} props.idInstructor - ID único del instructor para filtrar las fichas.
 *
 * @returns {Object} - Objeto con los siguientes valores:
 * @property {Array<Object>}  - Fichas activas transformadas.
 * @property {boolean} loading - Indica si los datos están siendo cargados.
 * @property {string|null} error - Error ocurrido al obtener las fichas, si hay algún error.
 *
 * @example
 * const { fichas, loading, error } = useFichasTransformadas({ idInstructor: '123' });
 * console.log(fichas); // [{ idFicha: 45, nombre: '2545521 - Tecnólogo en Confecciones' }]
 */
export const useFichasTransformadas = ({ idInstructor, estadoFicha }) => {
  //Estado para almacenar las fichas activas, carga y error
  const [fichasBD, setFichasBD] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Función para obtener las fichas activas de la base de datos
   * a partir del ID del instructor y un estado de ficha (activo).
   * Se ejecuta cuando el hook se monta o cuando cambia la dependencia `idInstructor`.
   *
   * Actualiza el estado de `fichaBD` con los datos obtenidos, y maneja el estado
   * de carga y posibles errores.
   *
   * @returns {Promise<void>}
   */
  const obtenerFichas = async () => {
    setLoading(true); // Inicia el estado de carga
    try {
      const fichas = await getFichasByIdInstructorAndState(
        idInstructor,
        estadoFicha
      );
      setFichasBD(fichas);
      //console.log('Fichas filtradas por instructor:', fichas);
    } catch (err) {
      setError('Error al obtener las fichas'); // Error de la solicitud
      console.error('Error en fetchFichas:', err);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  //Hook `useEffect` que ejecuta la petición para obtener las fichas activas del instructor
  //cada vez que cambie el `idInstructor`
  useEffect(() => {
    obtenerFichas();
  }, [idInstructor]); // Dependencias del useEffect

  //Memoizar las fichas transformadas para evitar cálculos innecesarios
  const fichas = useMemo(() => {
    return fichasBD.map((ficha) => ({
      idFicha: ficha.idFicha,
      nombre: `${ficha.numeroFicha} - ${ficha.nombrePrograma}`,
      estadoFicha: ficha.estadoFicha,
    }));
  }, [fichasBD]);

  return { fichas, loading, error }; // Retorna las fichas, estado de carga y error
};
