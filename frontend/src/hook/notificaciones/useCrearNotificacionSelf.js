import { useState } from 'react';
import { crearNotificacionSelf } from '../../services/Notificaciones';

const useCrearNotificacionSelf = () => {
  const [loading, setLoading] = useState(false);
  const fetchCrearNotificacionSelf = async (notificacionData) => {
    try {
      setLoading(true);
      const notificacion = await crearNotificacionSelf(notificacionData);
      return notificacion;
    } catch (error) {
      console.error(mensajeError, error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchCrearNotificacionSelf, loadingNotificacion: loading };
};

export { useCrearNotificacionSelf };
