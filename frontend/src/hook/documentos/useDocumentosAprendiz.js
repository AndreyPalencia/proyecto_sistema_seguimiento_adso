import { useEffect, useMemo, useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { obtenerDocumentosByIdFichaAprendiz } from '../../services/Documentos';
import {
  convertirEnFechaColombiana,
  formatoDocumento,
  tipoDocumentoOptions,
} from '../../utils/utils';

const useDocumentosAprendiz = (idFichaAprendiz) => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tiposDeDocumento, setTiposDeDocumento] = useState(new Set());
  const { showAlert } = useAlert();

  const MAX_DOCUMENTOS = 5;

  const fetchDocumentos = async () => {
    setLoading(true);
    try {
      const data = await obtenerDocumentosByIdFichaAprendiz(idFichaAprendiz);
      const documentosConFecha = data.map((documento) => ({
        idDocumento: documento.idDocumento,
        tipoDocumento:
          formatoDocumento?.[documento.tipoDocumento] ??
          'Formato no reconocido',
        observacion: documento.observacion,
        nombreDocumento: documento.nombreDocumento,
        fechaUltimaActualizacion: convertirEnFechaColombiana(
          documento.fechaUltimaActualizacion
        ),
        idFichaAprendiz: documento.idFichaAprendiz,
        estadoDocumento: documento.estadoDocumento,
      }));

      setDocumentos(documentosConFecha);
      setTiposDeDocumento(new Set(data.map((d) => d.tipoDocumento))); // Crea un nuevo Set aquí
    } catch (error) {
      console.error('Error al obtener los documentos', error.message);

      if (error.status === 404) {
        setDocumentos([]);
      } else {
        showAlert({
          message: `Error en la encontrar los documentos relacionados con el aprendiz .`,
          severity: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idFichaAprendiz) fetchDocumentos();
  }, [idFichaAprendiz, showAlert]);

  // Ensure types are updated correctly
  const tiposDisponibles = useMemo(() => {
    const tiposDisponiblesOpciones = tipoDocumentoOptions.filter(
      (option) => !tiposDeDocumento.has(option.value)
    );

    const opcionesDocumentos = tipoDocumentoOptions
      .filter((option) => !tiposDeDocumento.has(option.value))
      .map((option) => option.value);

    return {
      total: tiposDeDocumento.size,
      tiposDisponiblesOpciones,
      max: MAX_DOCUMENTOS,
      opcionesDocumentos,
    };
  }, [tiposDeDocumento]); // Recalculate when tiposDeDocumento changes
  //console.log('set', tiposDeDocumento)

  return {
    documentos,
    loading,
    refetchDocumentos: fetchDocumentos,
    tiposDisponibles,
  };
};

export { useDocumentosAprendiz };
