import {
  Typography,
  Dialog,
  DialogContent,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  obtenerNotificacion,
  modificarEstado,
} from '../services/Notificaciones';
import { useNumberNotifications } from '../context/NumberNotifications';
import Notificacion from '../components/Notificacion/Notificacion';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

/**
 *  `Notificaciones`
 *
 * Este componente representa un diálogo (modal) que muestra las notificaciones de un usuario.
 * Permite filtrar por tipo, marcarlas como leídas al abrirse, y archivarlas individualmente.
 *
 * Ademas cuenta con la funcionalidad de marca automáticamente como "Leída" las notificaciones que estaban como "NoLeída" al abrirse.
 * Se adapta a pantalla completa en dispositivos móviles (`useMediaQuery`), como tambien permite archivar o (eliminar visualmente)
 * una notificación del listado de notificaciones del modal.
 *
 * @param {boolean} open - Determina si el diálogo está abierto o cerrado.
 * @param {Function} handleClose - Función que se ejecuta para cerrar el diálogo.
 * @returns {JSX.Element} Dialogo con listado de notificaciones filtrables.
 *
 */
const Notificaciones = ({ open, handleClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  //Obtenemos idUsuario atraves del paramatros
  const { idUsuario } = useAuth();
  // Estado para manejar el tipo de notificación seleccionada
  const [valor, setValor] = useState('');
  //Declaramos un estado para guardar la notificiaciones que solicitamos al backend.
  const [notificaciones, setNotificaciones] = useState([]);

  //Extraemos la cantidad de notificiaciones sin leer de useNumberNotifications
  const { handleNumberNotifications } = useNumberNotifications();

  //Declaromos un array de elementos con tipos de notificiaciones
  const opciones = ['Alerta', 'Informacion', 'Error', 'Exito', 'Solicitud'];
  /**
   * Obtine las notificiaciones a partir del idUsuario y tambien obtiene el numero de notificaciones sin leer
   */
  const cargarNotificaciones = async () => {
    try {
      const response = await obtenerNotificacion(idUsuario, [
        'NoLeida',
        'Leida',
      ]);

      const { data: notificaciones } = response.data;

      setNotificaciones(notificaciones);

      handleNumberNotifications(
        notificaciones.filter((n) => n.estado === 'NoLeida').length
      );
    } catch (error) {
      if (error?.response?.status === 404) {
        // Si el error es 404, simplemente no hacemos nada y no mostramos un error.
        console.log('No hay notificaciones para este usuario.');
        return;
      }
      // Si es otro tipo de error, mostramos el error general.
      console.error('Error al obtener las notificaciones:', error.message);
    }
  };

  /**
   * Actualiza las notificaciones cuando se abre el dialogo a estado 'Leida'
   */

  const fetchActualizarNotificaciones = async () => {
    try {
      // Convertimos cada llamada a `modificarEstado` en una promesa y las esperamos con Promise.all
      await Promise.all(
        notificaciones
          .filter((notif) => notif.estado === 'NoLeida')
          .map((notif) => modificarEstado(notif.idNotificacion, 'Leida'))
      );

      // Actualizar estado de notificaciones a 'Leída' localmente
      setNotificaciones((prev) =>
        prev.map((notif) =>
          notif.estado === 'NoLeida' ? { ...notif, estado: 'Leida' } : notif
        )
      );

      // Una vez que todas las notificaciones se han actualizado en la base de datos, limpiamos el estado
      handleNumberNotifications(0);
    } catch (error) {
      console.error('Error al actualizar las notificaciones:', error);
    }
  };

  /**
   * Funcion para actualizar un notificacion a estado de archivada en la base de datos y removerla del array actual.
   */
  const archivarNotificacion = async (idNotificacion) => {
    try {
      await modificarEstado(idNotificacion, 'Archivada');

      // Remover del estado la notificación archivada
      setNotificaciones((prev) =>
        prev.filter((notif) => notif.idNotificacion !== idNotificacion)
      );
    } catch (error) {
      console.error('Error al archivar la notificación:', error);
    }
  };

  useEffect(() => {
    if (open) {
      cargarNotificaciones().then(() => {
        fetchActualizarNotificaciones();
      });
    }
  }, [open]);
  useEffect(() => {
    if (!open) {
      handleNumberNotifications(0);
    }
  }, [open]);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
        sx={{
          '& .MuiDialog-paper': !fullScreen && {
            position: 'fixed',
            right: '20px',
            top: '60px',
            width: '450px',
            borderRadius: 2,
            boxShadow: 3,
            p: 2,
            maxHeight: '80vh',
            overflowY: 'auto',
            backgroundColor: '#FFFFFF',
          },
        }}
      >
        <DialogContent>
          <Typography
            variant="h5"
            component="h3"
            sx={{
              marginBottom: 2,
              color: '#1C1B1F',
              display: 'flex',
              alignContent: 'center',
            }}
          >
            {fullScreen && (
              <IconButton size="small" onClick={handleClose}>
                <ArrowBackIcon className="icon-section-info" />
              </IconButton>
            )}
            Notificaciones
          </Typography>

          {opciones.length > 0 && (
            <Select
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                marginBottom: 2,
              }}
              fullWidth
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              variant="outlined"
              margin="dense"
              displayEmpty
            >
              <MenuItem value="">Todas</MenuItem>
              {opciones.map((opcion) => (
                <MenuItem key={opcion} value={opcion}>
                  {opcion}
                </MenuItem>
              ))}
            </Select>
          )}

          {notificaciones.length > 0 ? (
            notificaciones
              .filter((notif) => valor === '' || notif.tipo === valor) // Filtra según el tipo seleccionado
              .map((notif) => (
                <Notificacion
                  key={notif.idNotificacion}
                  titulo={notif.titulo}
                  descripcion={notif.mensaje}
                  onArchivar={() => archivarNotificacion(notif.idNotificacion)}
                />
              ))
          ) : (
            <Typography variant="body2" sx={{ mt: 2 }}>
              No hay notificaciones de este tipo.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Notificaciones;
