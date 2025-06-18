import { useState } from 'react';
import { useAlert } from '../../context/AlertContext';
import { crearNotificacion } from '../../services/Notificaciones';

const useCrearNotificacion = () => {
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  
  const fetchCrearNotificacion = async (
    notificacionData,
    {
      mensajeExito = 'Se envió la notificación.',
      mensajeError = 'Error al enviar la notificación.',
      tipoAlerta = 'success',
    } = {}
  ) => {
    try {
      setLoading(true);
      //console.log(notificacionData, 'dataNotfia antes');
      const notificacion = await crearNotificacion(notificacionData);
      //console.log(notificacion, 'data despues')
      showAlert({
        message: mensajeExito,
        severity: tipoAlerta,
        variant: 'standard',
      });
      return notificacion;
    } catch (error) {
      //console.error(mensajeError, error);
      showAlert({
        message: `${mensajeError} ${error.message}`,
        severity: 'error',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchCrearNotificacion, loading };
};

export { useCrearNotificacion };
