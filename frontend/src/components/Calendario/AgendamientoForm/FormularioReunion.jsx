import { Box } from '@mui/material';
import InputField from '../../FormFields/InputField';


/**
 * Componente `FormularioReunion`
 *
 * Componente de formulario para gestionar los datos relacionados con una reunión,
 * permitiendo ingresar la herramienta de la reunión y el enlace a la misma. Utiliza 
 * campos `InputField` para capturar la información de forma reutilizable.
 *
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.control - Objeto `control` de `react-hook-form`, utilizado para el manejo del formulario.
 * @param {boolean} [props.required=false] - Si es `true`, indica que los campos son obligatorios.
 * @param {boolean} [props.disabled=false] - Si es `true`, desactiva todos los campos del formulario.
 *
 * @returns {JSX.Element} Formulario con campos para ingresar la herramienta y el enlace de la reunión.
 */
const FormularioReunion = ({
  control,
  required = false,
  disabled = false,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <InputField
        name="herramientaReunion"
        label="Herramienta Reunión"
        control={control}
        required={required}
        disabled={disabled}
      />

      <InputField
        name="enlaceReunion"
        label="Enlace Reunión"
        type="url"
        control={control}
        required={required}
        disabled={disabled}
      />
    </Box>
  );
};

export default FormularioReunion;
