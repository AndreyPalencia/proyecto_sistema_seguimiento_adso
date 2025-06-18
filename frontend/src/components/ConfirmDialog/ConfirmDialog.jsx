import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';

/**
 * `ConfirmDialog`
 *
 * Componente de cuadro de diálogo de confirmación reutilizable. 
 * Muestra un mensaje de advertencia con opciones para confirmar o cancelar una acción.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.open - Controla si el diálogo está visible o no.
 * @param {string} [props.title] - Título del diálogo. Si no se proporciona, se usa un valor por defecto.
 * @param {string} [props.content] - Mensaje o descripción del diálogo. Si no se proporciona, se usa un mensaje predeterminado.
 * @param {Function} props.onConfirm - Función que se ejecuta al hacer clic en el botón "Confirmar".
 * @param {Function} props.onCancel - Función que se ejecuta al hacer clic en el botón "Cancelar" o al cerrar el diálogo.
 *
 * @returns {JSX.Element} Cuadro de diálogo de confirmación.
 */
const ConfirmDialog = ({ open, title, content, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      sx={{
        padding: '20px 40px 40px',
        '& .MuiDialogPaper-root': {
          border: '2px solid #EC221F', // Color de borde personalizado
          // Padding alrededor del diálogo
        },
      }}
    >
      <DialogTitle sx={{ paddingBottom: '16px' }}>
        {title || '¿Estás seguro?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ paddingBottom: '16px' }}>
          {content || 'Esta acción no se puede deshacer.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit" sx={{ paddingX: 3 }}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          sx={{
            backgroundColor: '#EC221F',
            '&:hover': {
              backgroundColor: '#b81a18', // Color de hover para el botón
            },
            paddingX: 3,
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;