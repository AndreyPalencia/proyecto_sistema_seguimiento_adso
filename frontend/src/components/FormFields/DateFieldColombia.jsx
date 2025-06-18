import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// Extensiones de dayjs
dayjs.extend(utc);

/**
 * Formatea una fecha UTC a 'YYYY-MM-DD' sin aplicar desfase de zona horaria.
 *
 * @param {string} value - Fecha en formato UTC.
 * @returns {string} - Fecha en formato 'YYYY-MM-DD'.
 */
const formatUtcDateOnly = (value) => {
  return value ? dayjs.utc(value).format('YYYY-MM-DD') : '';
};

/**
 * Recibe una fecha 'YYYY-MM-DD' del input (asumida como UTC) y la envía como string UTC.
 *
 * @param {string} localDate - Fecha seleccionada desde el input.
 * @param {function} onChange - Función para actualizar el valor.
 */
const handleDateOnlyChange = (localDate, onChange) => {
  if (!localDate) return onChange('');
  const parsed = dayjs(localDate, 'YYYY-MM-DD');
  if (!parsed.isValid()) return;
  const utcDate = parsed.utc().format('YYYY-MM-DD');
  onChange(utcDate);
};

/**
 * `DateFieldColombia`: Componente de campo de fecha que trata todas las fechas como UTC sin hora.
 *
 * @param {string} name - Nombre del campo.
 * @param {string} label - Etiqueta visible.
 * @param {object} control - Objeto de `react-hook-form`.
 * @param {string} [defaultValue=''] - Valor inicial en UTC ('YYYY-MM-DD' o ISO).
 * @param {boolean} [required=false] - Si es obligatorio.
 * @param {boolean} [disabled=false] - Si está deshabilitado.
 * @param {boolean} [inputLabel=false] - Si debe dejar espacio para el label aunque esté vacío.
 *
 * @returns {JSX.Element}
 */
const DateFieldColombia = ({
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
          type="date"
          value={formatUtcDateOnly(value)}
          onChange={(event) =>
            handleDateOnlyChange(event.target.value, onChange)
          }
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: inputLabel,
            },
          }}
          error={!!error}
          helperText={error?.message || ''}
          required={required}
          disabled={disabled}
        />
      )}
    />
  );
};

export default DateFieldColombia;
