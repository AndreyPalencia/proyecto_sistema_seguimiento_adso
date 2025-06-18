import React from 'react';
import { Controller } from 'react-hook-form';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from '@mui/material';

/**
 * Reusable RadioGroupField component.
 *
 * Integrates react-hook-form with Material UI's RadioGroup.
 *
 * @param {object} props - Component props.
 * @param {string} props.name - The name of the field in the form.
 * @param {string} props.label - The label above the radio group.
 * @param {object} props.control - The control object from react-hook-form.
 * @param {Array<{ label: string, value: string }>} props.options - List of radio options.
 * @param {string} [props.defaultValue] - Optional default selected value.
 * @param {boolean} [props.row=true] - Whether to display radios in a row.
 * @param {boolean} [props.disabled=false] - Disable all radios if true.
 *
 * @returns {JSX.Element} A controlled RadioGroup field.
 */
const RadioGroupField = ({
  name,
  label,
  control,
  options,
  defaultValue = '',
  row = true,
  disabled = false,
}) => {
  return (
    <FormControl component="fieldset">
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <RadioGroup
            {...field}
            row={row}
            onChange={(e) => field.onChange(e.target.value === 'true')}
          >
            {options.map((opt) => (
              <FormControlLabel
                key={opt.value}
                value={opt.value}
                control={<Radio />}
                label={opt.label}
                disabled={disabled}
              />
            ))}
          </RadioGroup>
        )}
      />
    </FormControl>
  );
};

export default RadioGroupField;
