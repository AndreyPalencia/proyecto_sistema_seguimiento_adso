import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

/**
 * Componente `TextAreaField`, diseñado exclusivamente para campos de texto multilínea (textarea),
 * integrándose con react-hook-form y MUI.
 *
 * @param {string} name - Nombre del campo para react-hook-form.
 * @param {string} label - Etiqueta del campo.
 * @param {object} control - Objeto `control` de react-hook-form.
 * @param {number} [rows=4] - Número de filas visibles.
 * @param {boolean} [required=false] - Si el campo es obligatorio.
 * @param {boolean} [disabled=false] - Si el campo está deshabilitado.
 * @returns {JSX.Element}
 */
const TextAreaField = ({
  name,
  label,
  control,
  minRows = 4,
  required = false,
  disabled = false,
  defaultValue,
  ...props
}) => {
  // Eliminate 'rows' prop if passed by mistake
  const { rows, ...safeProps } = props;

  return (
    <Controller
      name={name}
      control={control}
      {...(defaultValue !== undefined && { defaultValue })}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          multiline
          minRows={minRows}
          fullWidth
          required={required}
          disabled={disabled}
          error={!!fieldState.error}
          helperText={fieldState.error?.message || ''}
          {...safeProps}
        />
      )}
    />
  );
};

export default TextAreaField;
