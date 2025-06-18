import { useAprendizFicha } from '../../../../context/AprendizFichaContext';

import { Box, Typography, Button, Stack } from '@mui/material';

import { obtenerUsuario } from '../../../../services/Usuarios';

import { useObtenerUsuarioById } from '../../../../hook/usuarios/useObtenerUsuarioById';

import InputField from '../../../FormFields/InputField';
import SelectField from '../../../FormFields/SelectField';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

const AprendizSeleccionadaInfo = ({
  handleMostrarCrearAprendiz,
  handleAprendizSeleccionado,
}) => {
  const { idAprendiz, setAprendiz } = useAprendizFicha();

  const { usuario, loading } = useObtenerUsuarioById(idAprendiz);

  // const handleObtenerAprendiz = async (idAprendiz) => {
  //   try {
  //     const usuario = await obtenerUsuario(idAprendiz);
  //     return usuario;
  //   } catch (error) {
  //     console.error('Error al obtener la aprendiz.');
  //   }
  // };

  const { control, reset } = useForm({
    defaultValues: {
      tipoDocumento: '',
      numeroDocumento: '',
      nombre: '',
      apellido: '',
      correoElectronico: '',
      estadoUsuario: '',
    },
  });

  useEffect(() => {
    const fetchAprendiz = async () => {
      if (idAprendiz) {
        const aprendiz = usuario;
        if (aprendiz) {
          reset({
            tipoDocumento: aprendiz.tipoDocumento || '',
            numeroDocumento: aprendiz.numeroDocumento || '',
            nombre: aprendiz.nombre || '',
            apellido: aprendiz.apellido || '',
            correoElectronico: aprendiz.correoElectronico || '',
            estadoUsuario: aprendiz.estadoUsuario ? '1' : '0',
          });
        }
      }
    };

    fetchAprendiz();
  }, [idAprendiz, usuario, reset]); // ← ✅ Agregar usuario

  return (
    <Box sx={{ mx: 'auto', mt: 3 }}>
      <Typography sx={{ mb: 4 }} variant="h6" gutterBottom>
        Información del Aprendiz
      </Typography>

      {/* Contenedor de inputs en pares */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flex: '1 1 300px' }}>
          <SelectField
            name="tipoDocumento"
            control={control}
            label="Tipo de Documento"
            fullWidth
            menuOptions={[
              { label: 'Cédula de Ciudadanía', value: 'CC' },
              { label: 'Tarjeta de Identidad', value: 'TI' },
              { label: 'Cédula de Extranjería', value: 'CE' },
              { label: 'PEP', value: 'PEP' },
              { label: 'PPT', value: 'PPT' },
            ]}
            disabled
          />
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <InputField
            name="numeroDocumento"
            label="Número de Documento"
            control={control}
            disabled
            fullWidth
          />
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <InputField
            name="nombre"
            label="Nombre"
            control={control}
            disabled
            fullWidth
          />
        </Box>
        <Box sx={{ flex: '1 1 300px' }}>
          <InputField
            name="apellido"
            label="Apellido"
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
        <Box sx={{ flex: '1 1 300px' }}>
          <SelectField
            name="estadoUsuario"
            label="Estado"
            control={control}
            fullWidth
            menuOptions={[
              {
                label: 'Activo',
                value: '1',
              },
              {
                label: 'Inactivo',
                value: '0',
              },
            ]}
            sx={{ flex: '2 1 50px', minWidth: '200px' }}
            disabled
          />
        </Box>
      </Box>
      {/* Botones de acción */}

      <Stack
        variant="outlined"
        direction="row"
        spacing={2}
        sx={{
          display: 'flex',
          gap: 2,
          mt: 4,
          mb: 4,
          justifyContent: 'space-between',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleAprendizSeleccionado();

            setAprendiz(null);
          }}
          sx={{ margin: '2rem 0 1rem 0' }}
        >
          Buscar aprendiz
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            handleMostrarCrearAprendiz();
            setAprendiz(null);
          }}
          sx={{ margin: '2rem 0 1rem 0' }}
        >
          Crear Aprendiz
        </Button>
      </Stack>
    </Box>
  );
};

export default AprendizSeleccionadaInfo;
