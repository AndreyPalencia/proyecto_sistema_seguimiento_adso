import { Box } from '@mui/material';
import SelectField from '../../FormFields/SelectField';
import InputField from '../../FormFields/InputField';

/**
 * Componente `FormularioEstadoTipo`
 *
 * Componente de formulario que permite seleccionar el estado y el tipo de visita,
 * así como ingresar el número de la visita. Utiliza campos `SelectField` para el estado
 * y tipo de visita y un `InputField` para el número de visita.
 *
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.control - Objeto `control` de `react-hook-form`, utilizado para el manejo de formularios.
 * @param {boolean} [props.required=false] - Si es `true`, indica que los campos son obligatorios.
 * @param {boolean} [props.disabled=false] - Si es `true`, desactiva todos los campos del formulario.
 *
 * @returns {JSX.Element} Formulario con campos para seleccionar estado y tipo de visita, y un campo numérico para el número de visita.
 */
const FormularioEstadoTipo = ({
  control,
  required = false,
  disabled = false,
  isAprendiz = false
}) => {
  // Opciones para los selects
  const estadoOptions = [
    { value: 'Programada', label: 'Programada' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Realizada', label: 'Realizada' },
    { value: 'Cancelada', label: 'Cancelada' },
    { value: 'Reprogramada', label: 'Reprogramada' },
    { value: 'Solicitud', label: 'Solicitud' },
  ];

  const tipoOptions = [
    { value: 'Virtual', label: 'Virtual' },
    { value: 'Presencial', label: 'Presencial' },
    { value: 'Telefonica', label: 'Telefónica' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <SelectField
        name="estadoVisita"
        label="Estado Visita"
        control={control}
        required={required}
        disabled={disabled || isAprendiz}
        menuOptions={estadoOptions}
        inputLabel={true}
      />

      <SelectField
        name="tipoVisita"
        label="Tipo Visita"
        control={control}
        required={required}
        disabled={disabled}
        inputLabel={true}
        menuOptions={tipoOptions}
      />

      <InputField
        name="numeroVisita"
        label="Número de Visita"
        control={control}
        required={required}
        disabled={disabled}
        type="number"
        inputProps={{ min: 1, max: 3 }}
      />
    </Box>
  );
};

export default FormularioEstadoTipo;
