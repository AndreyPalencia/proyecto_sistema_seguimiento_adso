import React from 'react';
import { Controller } from 'react-hook-form';
import { Checkbox, FormControlLabel } from '@mui/material';



/**
 * Componente `CheckboxField` reutilizable.
 * 
 * Compatible con react-hook-form y basado en Material UI.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.name - Nombre del campo en el formulario.
 * @param {string} props.label - Etiqueta que se muestra junto al checkbox.
 * @param {object} props.control - Objeto `control` de react-hook-form.
 * @param {boolean} [props.defaultValue=false] - Valor por defecto.
 * @param {boolean} [props.disabled=false] - Desactiva el checkbox si es `true`.
 *
 * @returns {JSX.Element} Checkbox controlado por react-hook-form.
 */
const CheckboxField = ({
  name,
  label,
  control,
  defaultValue = false,
  disabled = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Checkbox
              {...field}
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={disabled}
            />
          }
          label={label}
        />
      )}
    />
  );
};

export default CheckboxField;
