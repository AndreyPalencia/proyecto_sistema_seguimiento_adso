import { Controller } from 'react-hook-form';
import { Checkbox, FormControlLabel, Box } from '@mui/material';

/**
 * BooleanCheckboxSelector
 *
 * Componente con dos "checkboxes" visuales, pero que controlan un solo valor booleano.
 * Si seleccionas "Satisfactorio" => true
 * Si seleccionas "Por mejorar" => false
 *
 * @param {string} name - Nombre del campo (controlado por react-hook-form).
 * @param {object} control - Objeto de control de react-hook-form.
 * @param {boolean} [defaultValue=true] - Valor inicial (true o false).
 */
const BooleanCheckboxSelector = ({ name, control, defaultValue = false }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', height: '100%'}} gap={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={field.value === true}
                onChange={() => field.onChange(true)}
              />
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={field.value === false}
                onChange={() => field.onChange(false)}
              />
            }
          />
        </Box>
      )}
    />
  );
};

export default BooleanCheckboxSelector;
