import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

//Extenciones de dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Convierte una fecha UTC a la zona horaria de Bogotá para mostrarla en el input.
 *
 * @param {string} value - Fecha en formato UTC.
 * @returns {string} Fecha formateada en la zona horaria de Bogotá (YYYY-MM-DDTHH:mm) o vacío.
 */
const convertUtcToBogota = (value) => {
  return value
    ? dayjs.utc(value).tz('America/Bogota').format('YYYY-MM-DDTHH:mm')
    : '';
};

/**
 * Convierte una fecha local ingresada por el usuario a UTC para guardarla en la base de datos.
 *
 * @param {string} localDate - Fecha en formato local (YYYY-MM-DDTHH:mm).
 * @param {Function} onChange - Función de react-hook-form para actualizar el valor.
 */
const handleDateChange = (localDate, onChange) => {
  if (!localDate) return onChange('');

  const bogotaDate = dayjs.tz(localDate, 'America/Bogota');
  if (!bogotaDate.isValid()) return;

  const utcDate = bogotaDate.utc().format();
  onChange(utcDate);
};

/**
 * Componente `DateTimeFieldColombia`, reutilizable basado en Material UI y react-hook-form.
 *
 * Componente que permite selecionar la fecha y hora con zona horaria de Bogotá.
 * Este campo permite ingresar y mostrar fechas en la zona horaria de Bogotá,
 * pero las fechas se almacenan en UTC en la base de datos.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.name - Nombre del campo, usado por react-hook-form.
 * @param {string} props.label - Etiqueta del campo de fecha y hora.
 * @param {Object} props.control - Objeto `control` de react-hook-form.
 * @param {string} [props.defaultValue=''] - Valor por defecto del campo de fecha y hora.
 * @param {boolean} [props.required=false] - Indica si el campo es obligatorio.
 * @param {boolean} [props.disabled=false] - Si es `true`, el campo está deshabilitado.
 * @param {boolean} [props.inputLabel=false] - Si es `true`, el label será "flotante" (deja el espacio incluso si el campo está vacío).
 *
 * @returns {JSX.Element} Un campo de entrada de fecha y hora compatible con react-hook-form.
 */

const DateTimeFieldColombia = ({
  name,
  label,
  control,
  defaultValue = '',
  required = false,
  disabled = false,
  inputLabel = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          name={name}
          label={label}
          type="datetime-local"
          value={convertUtcToBogota(value)}
          onChange={(event) => handleDateChange(event.target.value, onChange)}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: inputLabel,
            },
          }} // 5 min
          error={!!error}
          helperText={error?.message || ''}
          required={required}
          disabled={disabled}
        />
      )}
    />
  );
};

export default DateTimeFieldColombia;
