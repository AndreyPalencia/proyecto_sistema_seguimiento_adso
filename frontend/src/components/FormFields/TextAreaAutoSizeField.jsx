import { TextareaAutosize } from '@mui/material';
import { Controller } from 'react-hook-form';

/**
 * Componente `TextAreaField`, diseñado exclusivamente para campos de texto multilínea (textarea),
 * integrándose con react-hook-form y MUI.
 *
 * @param {string} name - Nombre del campo para react-hook-form.
 * @param {object} control - Objeto `control` de react-hook-form.
 * @param {boolean} [required=false] - Si el campo es obligatorio.
 * @param {boolean} [disabled=false] - Si el campo está deshabilitado.
 * @returns {JSX.Element}
 */

const TextAreaAutoSizeField = ({
  name,
  control,
  required = false,
  disabled = false,
  ...props
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => (
        <div>
          <TextareaAutosize
            key={`text-${name}`}
            minRows={3}
            style={{
              width: '100%',
              resize: 'vertical',
              fontSize: '16px',
              padding: '8px',
              borderColor: fieldState.error ? 'red' : '#ccc',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderRadius: '4px',
            }}
            {...field}
            placeholder="Escribe aquí..."
            disabled={disabled}
            required={required}
            {...props}
          />
          {fieldState.error && (
            <span style={{ color: 'red', fontSize: '0.875rem' }}>
              {fieldState.error.message}
            </span>
          )}
        </div>
      )}
    />
  );
};


export default TextAreaAutoSizeField;
