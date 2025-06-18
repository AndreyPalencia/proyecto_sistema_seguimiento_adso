import { Box, Typography, IconButton, Divider } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

/**
 * Componente `InfoCard`
 *
 * Este componente muestra una tarjeta de información con un título y un ítem. Al hacer clic en
 * el componente, se ejecuta la función `onToggleDialog`, que cambia el valor de un estado booleano en
 * el componente padre, lo cual puede controlar la visualización de un cuadro de diálogo o realizar
 * otras acciones. También incluye la opción de mostrar una línea divisoria entre tarjetas,
 * excepto si es la última tarjeta.
 *
 * @param {Object} props - Propiedades que se pasan al componente.
 * @param {string} props.titulo - El título de la tarjeta de información (requerido).
 * @param {string} props.item - El ítem o dato asociado al título que se muestra en la tarjeta (requerido).
 * @param {boolean} props.isLast - Un valor booleano que indica si es la última tarjeta. Si es `false`,
 * se mostrará una línea divisoria entre tarjetas (opcional, por defecto es `false`).
 * @param {Function} props.onToggleDialog - Una función que se ejecuta cuando se hace clic en el ícono de cierre.
 * Esta función se utiliza para cambiar el estado de un valor booleano en el componente padre, lo que
 * puede controlar la visualización de un cuadro de diálogo o realizar otras acciones (requerido).
 *
 * @example
 * <InfoCard
 *   titulo="Nombre del ítem"
 *   item="Descripción del ítem"
 *   isLast={false}
 *   onToggleDialog={() => setOpenDialog(true)} // Esta función cambiará el estado booleano para mostrar el cuadro de diálogo
 * />
 *
 * @returns {JSX.Element} - Devuelve la vista sobre item que se le paso con
 *                          función de mostrar el modal para realizar modificaciones.
 */

const InfoCard = ({ titulo, item, isLast, onToggleDialog }) => {
  return (
    <>
      <Box
        component="article"
        onClick={onToggleDialog}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          cursor: 'pointer',
          bgcolor: '#FFFFFF',
          textAlign: 'center',
          '&:hover': { bgcolor: '#f5f5f5' },
        }}
      >
        <Typography
          component="span"
          variant="subtitle1"
          sx={{ width: '200px', textAlign: 'start' }}
        >
          {titulo}
        </Typography>
        <Typography
          component="span"
          variant="subtitle1"
          fontWeight="400"
          color="#828282"
          sx={{ width: '200px', textAlign: 'start' }}
        >
          {item}
        </Typography>

        <IconButton size="small" onClick={onToggleDialog}>
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>

      {!isLast && <Divider sx={{ bgcolor: '#E0E0E0', height: '0.5px' }} />}
    </>
  );
};

export default InfoCard;
