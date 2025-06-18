import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

/**
 * Componente `EditInfoModal`
 *
 * Este componente muestra un cuadro de diálogo (modal) para editar la información. Dependiendo del tipo de dato (`tag`),
 * puede mostrar un campo de texto (`TextField`) o un menú desplegable (`Select`). Permite guardar o cancelar la edición.
 *
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.name - Nombre del campo que se está editando (requerido).
 * @param {string} props.type - Tipo de input del modal. Puede ser `"text"` por defecto o el valor ingresado.
 * @param {string} props.titulo - Título del modal, que describe qué se está editando (requerido).
 * @param {string|number} props.item - Valor actual del campo a editar (requerido).
 * @param {string} [props.tag='text'] - Etiqueta para indicarle al modal qué tipo de input mostrar. Puede ser `'text'`, `'select'`, `'date'`, etc. (opcional).
 * @param {boolean} [props.inputLabel=false] - Si es `true`, el label se comporta como `InputLabel` con shrink.
 * @param {Array<string>} [props.menuOpciones=[]] - Opciones del menú desplegable si `tag` es `'select'` (opcional).
 * @param {boolean} [props.disabled=false] - Desactiva el campo si es `true`.
 * @param {boolean} props.disableClick - Indica si el campo de entrada debe estar deshabilitado (requerido).
 * @param {boolean} props.isOpen - Controla si el modal está abierto o cerrado (requerido).
 * @param {Function} props.onClose - Función que se ejecuta cuando el usuario cierra el modal (requerido).
 * @param {Function} props.onSave - Función que se ejecuta cuando el usuario guarda los cambios (requerido).
 *
 * @example
 * <EditInfoModal
 *   name="emailType"
 *   type="select"
 *   titulo="Editar Tipo Correo"
 *   tag="select"
 *   item="opcionUno"
 *   menuOpciones={['opcionUno', 'opcionDos']}
 *   isOpen={true}
 *   onClose={() => setOpen(false)}
 *   onSave={(nuevoValor) => console.log('Guardar:', nuevoValor)}
 * />
 *
 * @returns {JSX.Element} - Devuelve el modal para realizar la actualización del item que se paso en las props.
 */

const EditInfoModal = ({
  name,
  type = 'text',
  titulo,
  item,
  tag,
  inputLabel,
  menuOpciones,
  disabled,
  disableClick,
  isOpen,
  onClose,
  onSave,
  isArrayOptions = false,
  valueKey = 'value', // 🔹 Nombre dinámico para `value`
  labelKey = 'label',
}) => {
  //Estado para almacenar el valor del value editado
  const [inputValue, setInputValue] = useState('');
  //Estado para permitir hacer click en boton Guardar
  const [isSave, setIsSave] = useState(true);

  /**
   * Maneja la actualización del valor editado y ejecuta la función `onSave`.
   * Convierte valores específicos si es necesario (por ejemplo, 'Activa' a 1, 'Inactiva' a 0).
   */
  const handleActualizarDato = () => {
    if (inputValue === item) {
      console.log('No hay cambios, no se envía actualización.');
      return;
    }

    let valorFinal = inputValue;

    //Conversión especial para estado Activa/Inactiva
    if (valorFinal === 'Activo' || valorFinal === 'Activa') {
      valorFinal = 1;
    } else if (valorFinal === 'Inactivo' || valorFinal === 'Inactiva') {
      valorFinal = 0;
    }

    //Llamamos a onSave con un objeto donde el name es la clave
    // console.log(valorFinal, typeof valorFinal);
    onSave({
      [name]: valorFinal,
    });
    onClose();
  };

  /**
   * Verifica si el valor ingresado es diferente al original para habilitar/deshabilitar el botón de guardar.
   * Convierte `item` a número si es necesario para comparaciones exactas.
   *
   * @param {string|number} nuevoValor - Valor actualizado del input.
   */
  const verificarCambio = (nuevoValor) => {
    //Verificamos si es tipo item es number
    const esNumero = typeof item === 'number';
    //Si lo es convertimos el nuevoValor en un numero y sino dejamos el nuevoValor si editar
    const valorComparado = esNumero ? Number(nuevoValor) : nuevoValor;
    setIsSave(valorComparado === item); // Actualiza el estado directamente
  };

  /**
   * Maneja el cambio en el campo de entrada y actualiza el estado.
   *
   * @param {Event} event - Evento de cambio del input.
   */
  const handleInputValue = (event) => {
    if (disableClick) return;
    const { value } = event.target;
    setInputValue(value);
    verificarCambio(value);
  };

  /**
   * Sincroniza el estado `inputValue` con el valor de `item` cuando el modal se abre.
   * Formatea las fechas si el tipo de entrada es `'date'`.
   */
  useEffect(() => {
    if (isOpen) {
      // Para fechas, aseguramos el formato correcto
      if (tag === 'date') {
        // If item is null or undefined or empty string, set to today
        const fecha = item ? new Date(item) : new Date();
        const formatoFecha = fecha.toISOString().split('T')[0];
        setInputValue(formatoFecha);
      } else {
        setInputValue(item || '');
      }
      setIsSave(true); // 🔁 Soluciona el problema del botón
    }
  }, [isOpen, item, tag]);

  return (
    <Dialog
      key={`${name - tag}`}
      open={isOpen}
      onClose={() => {
        setInputValue('');
        onClose();
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{ flexGrow: 1, textAlign: 'center', ml: 4 }}
            variant="title"
          >
            {disableClick ? `Vista ${titulo}` : `Editar ${titulo}`}
          </Typography>
          <Tooltip title="Cerrar formulario">
            <IconButton onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent>
        {tag === 'select' ? (
          <TextField
            fullWidth
            select
            label={titulo}
            disabled={disabled}
            value={inputValue}
            name={name}
            onChange={handleInputValue}
            margin="dense"
            variant="outlined"
            slotProps={{
              ...(inputLabel === true && {
                inputLabel: { shrink: true },
              }),
            }}
            key={`${name - tag} - ${titulo} -${type} `}
          >
            {menuOpciones.map((option, index) => {
              const value = isArrayOptions ? option : option[valueKey];
              const label = isArrayOptions ? option : option[labelKey];
              return (
                <MenuItem key={`${value}-${index}`} value={value}>
                  {label}
                </MenuItem>
              );
            })}
          </TextField>
        ) : tag === 'date' ? (
          <TextField
            fullWidth
            label={titulo}
            disabled={disabled}
            variant="outlined"
            type="date"
            value={inputValue}
            onChange={handleInputValue}
            margin="dense"
            key={`${name - tag} - ${type}- ${titulo}`}
          />
        ) : (
          <TextField
            fullWidth
            label={titulo}
            disabled={disabled}
            type={type}
            variant="outlined"
            value={inputValue}
            onChange={handleInputValue}
            margin="dense"
            key={` ${titulo}-${name - tag}`}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Stack direction="row" spacing={2} sx={{ px: 2, pb: '14px' }}>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Cerrar
          </Button>
          {!disableClick && (
            <Button
              onClick={handleActualizarDato}
              color="primary"
              variant="contained"
              disabled={isSave}
            >
              Guardar
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default EditInfoModal;
