import { useState } from 'react';
import { descarDocumentosFicha } from '../services/ArchivosGenerados';
import { useAlert } from '../context/AlertContext';
// Ajusta la ruta si tu servicio está en otro lugar

export const useDescargarDocumentosFicha = () => {
  const [loading, setLoading] = useState(false);

  const { showAlert } = useAlert();

  const descargarDocumentosFicha = async (idFicha) => {
    setLoading(true);

    try {
      await descarDocumentosFicha(idFicha);
    } catch (error) {
      console.error('Error en hook al descargar ZIP:', error);

      if (error.status === 400) {
        showAlert({
          message: 'No se encontraron aprendices para la ficha.',
          severity: 'info',
          variant: 'standard',
        });
      } else {
        showAlert({
          message: `No se pudo descargar el archivo. ${error.message}`,
          severity: 'error',
          variant: 'standard',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return { descargarDocumentosFicha, loading };
};
