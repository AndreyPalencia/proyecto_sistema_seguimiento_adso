import { useEffect } from 'react';
import { useAprendizFicha } from '../../../../context/AprendizFichaContext';

import { Box, Button, Stack, Typography } from '@mui/material';

import InputField from '../../../FormFields/InputField';

import { useCrearEmpresa } from '../../../../hook/empresas/useCrearEmpresa';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formCrearEmpresa } from '../../../../schemas/formEmpresa';

const FormCrearEmpresa = ({ handleVolverBuscar }) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(formCrearEmpresa),
    defaultValues: {
      razonSocial: '',
      nit: '',
      direccion: '',
      telefono: '',
      correoElectronico: '',
    },
  });

  const { fetchCrearEmpresa } = useCrearEmpresa();

  const { setEmpresaSeleccionada, idEmpresa } = useAprendizFicha();

  const onSubmit = async (formData) => {
    try {
      const empresa = await fetchCrearEmpresa(formData);
      if (empresa?.idEmpresa) {
        setEmpresaSeleccionada(empresa.idEmpresa);
      } else {
        console.error('No se recibió idEmpresa al crear empresa');
      }
    } catch (error) {
      console.error('Error al crear empresa:', error);
    }
  };

  useEffect(() => {
    if (idEmpresa) {
      console.log('idEmpresa actualizado:', idEmpresa);
    }
  }, [idEmpresa]);

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" gutterBottom>
          Crear Empresa
        </Typography>

        <Box sx={{ width: '100%', padding: '20px 10px 5px 0' }}>
          <Box sx={{ mb: 2 }}>
            <InputField
              name="razonSocial"
              label="Nombre de la empresa"
              control={control}
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <InputField
              name="nit"
              label="NIT de la empresa"
              control={control}
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <InputField
              name="direccion"
              label="Dirección de la empresa"
              control={control}
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <InputField
              name="telefono"
              label="Teléfono de la empresa"
              control={control}
              type="number"
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <InputField
              name="correoElectronico"
              label="Correo electrónico de la empresa"
              control={control}
              type="email"
              required
            />
          </Box>
          <Stack
            direction="row"
            spacing={2}
            variant="outlined"
            sx={{ gap: '10px', justifyContent: 'space-between' }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ margin: '2rem 0 1rem 0' }}
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              color='secondary'
              onClick={handleVolverBuscar}
              sx={{ margin: '2rem 0 1rem 0' }}
            >
              Buscar Empresa
            </Button>
          </Stack>
        </Box>
      </form>
    </Box>
  );
};

export default FormCrearEmpresa;
