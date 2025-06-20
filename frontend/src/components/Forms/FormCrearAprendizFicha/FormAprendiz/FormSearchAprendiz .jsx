import { useEffect, useState } from 'react';
import { useCheckbox } from '../../../../context/CheckboxContext';
import { useAprendizFicha } from '../../../../context/AprendizFichaContext';

import { Box, Button, Stack } from '@mui/material';

import { buscarUsuario } from '../../../../services/Usuarios';

import InputField from '../../../FormFields/InputField';
import { TablaSelect } from '../../../Tabla/Tabla';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formBuscarAprendiz } from '../../../../schemas/formUsuarios';
import SelectField from '../../../FormFields/SelectField';

const FormSearchAprendiz = ({
  aprendizSeleccionado,
  handleMostrarCrearAprendiz,
  handleAprendizSeleccionado,
}) => {
  const [aprendicesEncontrados, setAprendicesEncontrados] = useState([]);
  const { selectedId, clearSelection } = useCheckbox();
  const { idAprendiz, setAprendiz } = useAprendizFicha();

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(formBuscarAprendiz),
    defaultValues: {
      numeroDocumento: '',
      estadoUsuario: '1',
      nombre: '',
      apellido: '',
      correoElectronico: '',
    },
  });

  const handleSearchAprendices = async (searchData) => {
    try {
      const aprendices = await buscarUsuario(searchData);
      //console.log(aprendices);
      setAprendicesEncontrados(aprendices);
    } catch (error) {
      console.error('Error al buscar aprendices:', error);
    }
  };

  const seleccionarAprendiz = () => {
    if (!selectedId) return;
    setAprendiz(selectedId);
  };

  const onSubmit = async (formData) => {
    //console.log(formData);
    await handleSearchAprendices(formData);
  };

  useEffect(() => {
    if (idAprendiz) {
      console.log(idAprendiz, 'Selecionado');
    }
  }, [idAprendiz]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 4,
            mb: 2,
            pb: 2,
            pt: 3,
          }}
        >
          <InputField
            type="number"
            name="numeroDocumento"
            label="Número de Documento"
            control={control}
            fullWidth
            sx={{ flex: '2 1 50px', minWidth: '250px' }}
          />
          <InputField
            name="nombre"
            label="Nombre"
            control={control}
            fullWidth
            sx={{ flex: '2 1 50px', minWidth: '250px' }}
          />
          <InputField
            name="apellido"
            label="Apellido"
            control={control}
            fullWidth
            sx={{ flex: '2 1 50px', minWidth: '250px' }}
          />
          <InputField
            name="correoElectronico"
            label="Correo Electrónico"
            control={control}
            fullWidth
            sx={{ flex: '3 1 50px', minWidth: '300px' }}
          />
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
          />
          <Box
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ width: '100%', maxWidth: '200px', height: '50px' }}
              >
                Buscar
              </Button>
            </Box>
          </Box>
        </Box>
      </form>

      <Box>
        <TablaSelect
          data={aprendicesEncontrados || []}
          dataException={[
            'idUsuario',
            'password',
            'estadoUsuario',
            'idAprendiz',
            'rol',
            'idFicha',
            'idFichaAprendiz',
          ]}
          selectedValue={'idUsuario'}
          header={[
            'Tipo documento',
            'Numero documento',
            'Nombre',
            'Apellido',
            'Telefono',
            'Correo electrónico',
            'Firma',
          ]}
        />

        <Stack
          spacing={2}
          direction="row"
          sx={{ gap: '10px', justifyContent: 'flex-end', mt: '24px' }}
        >
          <Button
            variant="outlined"
            color="secondary"
            disabled={aprendizSeleccionado}
            onClick={handleMostrarCrearAprendiz}
            sx={{ margin: '2rem 0 1rem 0' }}
          >
            Crear Aprendiz
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={!selectedId}
            onClick={() => {
              seleccionarAprendiz();
              handleAprendizSeleccionado();
              clearSelection();
            }}
            sx={{ margin: '2rem 0 1rem 0' }}
          >
            Seleccionar Aprendiz
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default FormSearchAprendiz;
