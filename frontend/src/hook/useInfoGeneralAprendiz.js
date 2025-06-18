import { useState, useEffect, useMemo } from 'react';
import { getInfoAprendizByFichaAndAprendiz } from '../services/FichaAprendiz';

export const useInfoGeneralAprendiz = ({ idFichaAprendiz }) => {
  const [aprendiz, setAprendiz] = useState({});
  const [ficha, setFicha] = useState({});
  const [empresa, setEmpresa] = useState({});
  const [infoFichaAprendiz, setInfoFichaAprendiz] = useState({});
  //const [infoInstructor, setInfoInstructor] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch para obtener los aprendices por ficha

  const FichaAprenidizByFichaAndAprendiz = async () => {
    try {
      setLoading(true);
      const FichaAprendiz = await getInfoAprendizByFichaAndAprendiz(
        idFichaAprendiz
      );
      setInfoFichaAprendiz(FichaAprendiz);
      setAprendiz(FichaAprendiz.Usuario);
      setFicha(FichaAprendiz.Ficha);
      setEmpresa(FichaAprendiz.Empresa);
      //setInfoInstructor(FichaAprendiz.Ficha.Usuario);
    } catch (error) {
      console.error('Error al obtener los estudiantes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idFichaAprendiz) FichaAprenidizByFichaAndAprendiz();
  }, [idFichaAprendiz]); // Se ejecuta cuando cambian las fichas o el instructor

  // const usuarioAprendiz = useMemo(() => {
  //   return {
  //     nombre: `${aprendiz.nombre} ${aprendiz.apellido}`,
  //     numeroDocumento: aprendiz.numeroDocumento,
  //     telefono: aprendiz.telefono,
  //     correoElectronico: aprendiz.correoElectronico,
  //     alternativa: infoFichaAprendiz.alternativa,
  //   };
  // }, [aprendiz]);

  // const datosFicha = useMemo(() => {
  //   return {
  //     nombrePrograma: ficha.nombrePrograma,
  //     numeroFicha: ficha.numeroFicha,
  //   };
  // }, [ficha]);

  // const datosEmpresa = useMemo(() => {
  //   return empresa
  // }, [empresa]);

  // const infoInstructorAprendiz = useMemo(() => {
  //   return {
  //     nombre: `${infoInstructor?.nombre} ${infoInstructor?.apellido}`,
  //     coreoElectronico: infoInstructor.correoElectronico,
  //     telefono: infoInstructor.telefono,
  //   };
  // }, [infoInstructor]);

  return {
    ficha,
    aprendiz,
    empresa,
    infoFichaAprendiz,
    // infoInstructorAprendiz,
    loading,
  };
};
