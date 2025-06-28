import { TextField, InputAdornment } from '@mui/material';
import { Controller } from 'react-hook-form';

/**
 * Componente `InputField`, reutilizable basado en Material UI y react-hook-form.
 *
 * @param {object} props
 * @returns {JSX.Element}
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
  type,
  ...props
}) => {
  const isNumberType = type === 'number';

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
      rules={{
        validate: (value) => {
          // Validar números naturales si es tipo number
          if (isNumberType) {
            if (value === '') return true;
            if (!Number.isInteger(value) || value < 0) {
              return 'Solo se permiten números naturales';
            }
          }
          // Validación adicional externa
          return validate ? validate(value) : true;
        },
      }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error?.message || ''}
          slotProps={{ input: adornments }}
          fullWidth={fullWidth}
          required={required}
          disabled={disabled}
          type={type}
          onWheel={isNumberType ? (e) => e.target.blur() : undefined}
          onKeyDown={(e) => {
            if (isNumberType && ['e', 'E', '+', '-'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            const value = e.target.value;
            field.onChange(
              isNumberType ? (value === '' ? '' : Number(value)) : value
            );
          }}
          onBlur={(e) => {
            const value = e.target.value;
            field.onChange(
              isNumberType ? (value === '' ? '' : Number(value)) : value
            );
            field.onBlur();
          }}
          {...props}
        />
      )}
    />
  );
};

export default InputField;
