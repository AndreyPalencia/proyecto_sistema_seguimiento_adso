import { Typography, Button, Box, FormHelperText } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

const UploadFileField = ({ name, control, label }) => {
  const [fileName, setFileName] = useState('');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            {label}
          </Typography>

          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            Seleccionar archivo
            <input
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                setFileName(file?.name || '');
                onChange(file);
              }}
            />
          </Button>

          {fileName && (
            <Typography variant="body2" color="textSecondary">
              Archivo seleccionado: {fileName}
            </Typography>
          )}

          {/* Mostrar error si existe */}
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Box>
      )}
    />
  );
};

export default UploadFileField;
