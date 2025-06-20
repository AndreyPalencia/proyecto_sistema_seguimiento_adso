import { useAprendizFicha } from '../../../../context/AprendizFichaContext';

import { Box, Typography, Button, Stack } from '@mui/material';

import { obtenerEmpresa } from '../../../../services/Empresa';

import InputField from '../../../FormFields/InputField';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

const EmpresaSeleccionadaInfo = ({
  handleEmpresaSeleccionado,
  handleMostrarCrearEmpresa,
}) => {
  const { idEmpresa, setEmpresaSeleccionada } = useAprendizFicha();

  const handleObtenerEmpresa = async (idEmpresa) => {
    try {
      const empresa = await obtenerEmpresa(idEmpresa);
      //console.log(empresa)
      return empresa;
    } catch (error) {
      console.error('Error al obtener la empresa.');
    }
  };

  const { control, getValues, reset } = useForm({
    defaultValues: {
      razonSocial: '',
      nit: '',
      telefono: '',
      direccion: '',
      correoElectronico: '',
    },
  });

  useEffect(() => {
    const fetchEmpresa = async () => {
      if (idEmpresa) {
        const empresa = await handleObtenerEmpresa(idEmpresa);
        if (empresa) {
          reset({
            razonSocial: empresa.razonSocial || '',
            nit: empresa.nit || '',
            telefono: empresa.telefono || '',
            direccion: empresa.direccion || '',
            correoElectronico: empresa.correoElectronico || '',
          });
        }
      }
    };

    fetchEmpresa();
  }, [idEmpresa, reset]);

  return (
    <Box sx={{ mx: 'auto', mt: 3 }}>
      <Typography sx={{ mb: 4 }} variant="h6" gutterBottom>
        Empresa Seleccionada
      </Typography>

      {/* Contenedor de inputs en pares */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <InputField
            name="razonSocial"
            label="Nombre de la empresa"
            control={control}
            disabled
            fullWidth
          />
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <InputField
            name="nit"
            label="NIT"
            control={control}
            disabled
            fullWidth
          />
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <InputField
            name="telefono"
            label="Teléfono"
            control={control}
            disabled
            fullWidth
          />
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <InputField
            name="direccion"
            label="Dirección"
            control={control}
            disabled
            fullWidth
          />
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <InputField
            name="correoElectronico"
            label="Correo electrónico"
            control={control}
            disabled
            fullWidth
          />
        </Box>
        {/* <Box sx={{ flex: '1 1 100%', mt: 2 }}>
          <TextAreaField
            name="descripcion"
            label="Descripción"
            control={control}
            disabled
            fullWidth
            minRows={3}
          />
        </Box> */}
      </Box>
      {/* Botones de acción */}
      <Stack
        spacing={2}
        direction="row"
        justifyContent="flex-end"
        variant="outlined"
        sx={{ display: 'flex', gap: 2, mt: 4, mb: 4 }}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            handleMostrarCrearEmpresa();
            setEmpresaSeleccionada(null);
          }}
        >
          Crear Empresa
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleEmpresaSeleccionado();
            setEmpresaSeleccionada(null);
          }}
        >
          Buscar Empresa
        </Button>
      </Stack>
    </Box>
  );
};

export default EmpresaSeleccionadaInfo;
