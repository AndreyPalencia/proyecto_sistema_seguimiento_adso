import { useEffect, useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { getFichasByIdInstructorAndState } from '../../services/Fichas';

const useObtenerFichas = (idInstructor) => {
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showAlert } = useAlert();

  const fetchFichas = async () => {
    try {
      setLoading(true);
      const fichasList = await getFichasByIdInstructorAndState(idInstructor);
      //console.log(fichasList)
      setFichas(fichasList);
    } catch (error) {
      if (error.status === 404) {
        showAlert({
          message: `No se encontraron fichas relacionadas con instructor.`,
          severity: 'warning',
          variant: 'standard',
        });
      }
      showAlert({
        message: `Error al obtener las fichas realcionadas con el instructor.`,
        severity: 'error',
      });
      console.error(
        'Error al obtener las fichas realcionadas con el instructor.',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idInstructor) fetchFichas();
  }, [idInstructor, showAlert]);

  return { loading, fichas, refetchFichas: fetchFichas };
};

export { useObtenerFichas };
