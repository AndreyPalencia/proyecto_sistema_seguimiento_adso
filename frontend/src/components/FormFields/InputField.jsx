import { TextField, InputAdornment } from '@mui/material';
import { Controller } from 'react-hook-form';

/**
 * Componente `InputField`, reutilizable basado en Material UI y react-hook-form.
 *
 * Permite crear un campo de entrada con adornos (íconos) al inicio o al final.
 *
 * @param {object} props - Propiedades que se pasarán al componente `TextField` de MUI.
 * @param {string} props.name - Nombre del campo, usado por react-hook-form.
 * @param {string} props.label - Etiqueta del campo.
 * @param {object} props.control - Objeto `control` de react-hook-form.
 * @param {React.ReactNode} [props.startIcon] - Ícono opcional al inicio del campo.
 * @param {React.ReactNode} [props.endIcon] - Ícono opcional al final del campo.
 * @param {function} [props.onClickIcon] - Función ejecutada al hacer clic en el `endIcon`.
 * @param {string|number} [props.defaultValue=''] - Valor por defecto del campo.
 * @param {boolean} [props.fullWidth=true] - Define si el campo debe ocupar todo el ancho.
 * @param {boolean} [props.required=false] - Indica si el campo es obligatorio.
 * @param {boolean} [props.disabled=false] - Desactiva el campo si es `true`.
 * @param {function} [props.validate] - Función opcional para validación personalizada que se pasará a `react-hook-form`.
 * @param {object} [props] - Propiedades adicionales que se pasarán al componente `TextField` de MUI.
 *
 * @returns {JSX.Element} Un campo de texto con adornos opcionales y compatible con react-hook-form.
 */

const InputField = ({
  name,
  label,
  control,
  startIcon,
  endIcon,
  onClickIcon,
  defaultValue = '',
  fullWidth = true,
  required = false,
  disabled = false,
  validate,
  ...props
}) => {
  const adornments = {
    startAdornment: startIcon ? (
      <InputAdornment position="start">{startIcon}</InputAdornment>
    ) : null,
    endAdornment: endIcon ? (
      <InputAdornment
        position="end"
        onClick={onClickIcon}
        style={{ cursor: onClickIcon ? 'pointer' : 'default' }}
      >
        {endIcon}
      </InputAdornment>
    ) : null,
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{ validate }}
      render={({ field, fieldState }) => (
        <TextField
          {...field} //react-hook-form ya maneja `onChange`
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error?.message || ''}
          slotProps={{ input: adornments }}
          fullWidth={fullWidth}
          required={required}
          disabled={disabled}
          {...props}
        />
      )}
    />
  );
};

export default InputField;
