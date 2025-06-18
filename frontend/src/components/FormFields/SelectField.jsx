import { TextField, MenuItem, InputAdornment } from '@mui/material';
import { Controller } from 'react-hook-form';

/**
 * Componente `SelectField`, reutilizable basado en Material UI y react-hook-form.
 *
 * Componente flexible que soporta un campo de selección dinámico y permite la incorporación de adornos (íconos) personalizables.
 *
 * @param {object} props - Propiedades que se pasarán al componente `TextField` de MUI.
 * @param {string} props.name - Nombre del campo, usado por react-hook-form.
 * @param {string} props.label - Etiqueta del campo.
 * @param {object} props.control - Objeto `control` de react-hook-form.
 * @param {React.ReactNode} [props.startIcon] - Ícono opcional al inicio del campo.
 * @param {React.ReactNode} [props.endIcon] - Ícono opcional al final del campo.
 * @param {function} [props.onClickIcon] - Función ejecutada al hacer clic en el `endIcon`.
 * @param {object|array} props.menuOptions - Opciones que se mostrarán en el dropdown. Puede ser:
 *   - Un **array de valores** como `['Opción 1', 'Opción 2']`.
 *   - Un **objeto de clave-valor**, como `{ 'valor1': 'Etiqueta 1', 'valor2': 'Etiqueta 2' }`.
 *   - Un **array de objetos** con propiedades `value` y `label`, como `[{ value: 'valor1', label: 'Etiqueta 1' }, { value: 'valor2', label: 'Etiqueta 2' }]`.
 * @param {boolean} [props.isArrayOptions=false] - Indica si deber rendizar un array.
 * @param {string|number} [props.defaultValue=''] - Valor por defecto del campo.
 * @param {boolean} [props.fullWidth=true] - Define si el campo debe ocupar todo el ancho.
 * @param {boolean} [props.required=false] - Indica si el campo es obligatorio.
 * @param {boolean} [props.disabled=false] - Desactiva el campo si es `true`.
 * @param {boolean} [props.inputLabel=false] - Si es `true`, el label se comporta como `InputLabel` con shrink.
 * @param {string} [props.valueKey='value'] - Clave utilizada para obtener el valor de cada opción.
 * @param {string} [props.labelKey='label'] - Clave utilizada para obtener el texto visible de cada opción.
 * @param {object} [props] - Propiedades adicionales que se pasarán al componente `TextField` de MUI.
 *
 * @returns {JSX.Element} Un campo de selección estilizado compatible con react-hook-form.
 */

const SelectField = ({
  name,
  label,
  control,
  startIcon,
  endIcon,
  onClickIcon,
  menuOptions = [],
  isArrayOptions = false,
  defaultValue = '',
  fullWidth = true,
  required = false,
  disabled = false,
  inputLabel = false, // 🔹 Propiedad para mostrar el label como inputLabel
  valueKey = 'value', // 🔹 Nombre dinámico para `value`
  labelKey = 'label', // 🔹 Nombre dinámico para `label`
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
      defaultValue={defaultValue ? defaultValue : undefined}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          select
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error?.message || ''}
          slotProps={{
            input: adornments,
            ...(inputLabel === true && {
              inputLabel: { shrink: true },
            }),
          }}
          fullWidth={fullWidth}
          required={required}
          disabled={disabled}
          {...props}
        >
          {menuOptions?.length > 0 ? (
            menuOptions.map((option) => {
              const value = isArrayOptions ? option : option[valueKey];
              const label = isArrayOptions ? option : option[labelKey];
              return (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              );
            })
          ) : (
            <MenuItem disabled>No hay opciones disponibles</MenuItem>
          )}
        </TextField>
      )}
    />
  );
};

export default SelectField;
