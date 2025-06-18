import { Box } from '@mui/material';
import DateTimeFieldColombia from '../../FormFields/DateTimeFieldColombia';

/**
 * Componente `FormularioFechas`
 *
 * Componente de formulario que permite seleccionar las fechas de inicio y fin utilizando el componente `DateTimeFieldColombia`.
 * Los campos de fecha están diseñados para aceptar fechas en la zona horaria de Bogotá, Colombia.
 *
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.control - Objeto `control` de `react-hook-form`, utilizado para el manejo de formularios.
 * @param {boolean} [props.required=false] - Si es `true`, indica que los campos son obligatorios.
 * @param {boolean} [props.disabled=false] - Si es `true`, desactiva los campos del formulario.
 *
 * @returns {JSX.Element} Formulario con campos de fecha de inicio y fecha de fin.
 */ 
const FormularioFechas = ({
  control,
  required = false,
  disabled = false,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <DateTimeFieldColombia
        name="fechaInicio"
        label="Fecha Inicio"
        control={control}
        inputLabel={true}
        required={required}
        disabled={disabled}
      />

      <DateTimeFieldColombia
        name="fechaFin"
        label="Fecha Fin"
        inputLabel={true}
        control={control}
        required={required}
        disabled={disabled}
      />
    </Box>
  );
};

export default FormularioFechas;
