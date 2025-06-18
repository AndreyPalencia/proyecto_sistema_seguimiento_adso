import { useEffect } from 'react';
import { socket } from '../../socket';
import { useNumberNotifications } from '../../context/NumberNotifications';

const useSocketNotifications = (idUsuario) => {
  const { incrementNumberNotifications } = useNumberNotifications();

  useEffect(() => {
    if (idUsuario) {
      socket.emit('registrarUsuario', Number(idUsuario));
    }

    const handleNotificacion = (data) => {
      console.log('Notificación recibida:', data);
      incrementNumberNotifications(); // Incrementar el contador
    };

    socket.on('notification', handleNotificacion);

    return () => {
      socket.off('notification', handleNotificacion);
    };
  }, [idUsuario, incrementNumberNotifications]);
};

export { useSocketNotifications };
