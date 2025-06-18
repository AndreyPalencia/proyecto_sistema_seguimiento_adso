import { Box, TextField } from '@mui/material';

/**
 * CampoTexto
 *
 * Campo de texto solo lectura, estilizado para evitar el color gris de los inputs deshabilitados.
 *
 * @param {object} props
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.value - Valor a mostrar
 * @param {...any} props - Cualquier otra prop válida de MUI TextField
 */
const InputText = ({ label, value, fullRow = false, ...props }) => {
  return (
    <Box sx={{ flex: fullRow ? '0 0 100%' : '0 0 48%', mb: 2 }}>
      <TextField
        label={label}
        value={value}
        fullWidth
        slotProps={{
          input: {
            readOnly: true,
          },
        }}
        variant="outlined"
        sx={{
          '& input': {
            WebkitTextFillColor: '#000',
          },
          ...props.sx,
        }}
        {...props}
      />
    </Box>
  );
};

export default InputText;
