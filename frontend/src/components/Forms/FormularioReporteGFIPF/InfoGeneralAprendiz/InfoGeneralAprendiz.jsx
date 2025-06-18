import { useEffect, useState } from 'react';

import { Box, Typography, TextField } from '@mui/material';

import InputField from '../../../FormFields/InputField';

const InfoGeneralAprendiz = ({
  aprendiz,
  ficha,
  control,
  setValue,
  isEdit = false,
}) => {
  // Estado de carga

  useEffect(() => {
    if (aprendiz && ficha && !isEdit) {
      // Establecer los valores en el formulario una vez que los datos estén disponibles
      setValue('infoGeneral.regional', '');
      setValue('infoGeneral.centroFormacion', '');
    }
  }, [aprendiz, ficha, setValue, isEdit]);

  return (
    <>
      <Typography
        component="h1"
        variant="h5"
        fontWeight="600"
        sx={{ margin: '20px 0 5px 0' }}
      >
        Información General
      </Typography>
      <Box sx={{ display: 'flex', padding: '30px 0px', gap: '25px' }}>
        <Box sx={{ width: '600px' }}>
          <InputField
            name="infoGeneral.regional"
            label="Regional"
            control={control}
            required={true}
          />
        </Box>
        <Box sx={{ width: '600px' }}>
          <InputField
            name="infoGeneral.centroFormacion"
            label="Centro de Formación"
            control={control}
            required={true}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', padding: '30px 0px', gap: '25px' }}>
        <Box sx={{ width: '600px' }}>
          <TextField
            value={ficha?.nombrePrograma ?? ''}
            label="Programa de Formación"
            required
            disabled
            fullWidth
          />
        </Box>
        <Box sx={{ width: '600px' }}>
          <TextField
            value={ficha?.numeroFicha ?? ''}
            label="Número de Ficha"
            required
            disabled
            fullWidth
          />
        </Box>
      </Box>

      <Typography
        component="h1"
        variant="h5"
        fontWeight="600"
        sx={{ margin: '20px 0 5px 0' }}
      >
        Información Aprendiz
      </Typography>
      <Box sx={{ display: 'flex', padding: '30px 0px', gap: '25px' }}>
        <Box sx={{ width: '600px' }}>
          <TextField
            value={`${aprendiz?.nombre} ${aprendiz?.apellido}` ?? ''}
            label="Nombre del Aprendiz"
            required
            disabled
            fullWidth
          />
        </Box>
        <Box sx={{ width: '600px' }}>
          <TextField
            value={aprendiz?.numeroDocumento ?? ''}
            label="Identificación del Aprendiz"
            required
            disabled
            fullWidth
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', padding: '30px 0px', gap: '25px' }}>
        <Box sx={{ width: '600px' }}>
          <TextField
            value={aprendiz?.telefono ?? ''}
            label="Teléfono del Aprendiz"
            required
            disabled
            fullWidth
          />
        </Box>
        <Box sx={{ width: '600px' }}>
          <TextField
            value={aprendiz?.correoElectronico ?? ''}
            label="Correo Electrónico"
            required
            disabled
            fullWidth
          />
        </Box>
      </Box>
    </>
  );
};

export default InfoGeneralAprendiz;
