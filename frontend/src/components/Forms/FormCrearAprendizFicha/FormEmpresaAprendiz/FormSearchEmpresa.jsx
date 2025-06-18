import { useEffect, useState } from 'react';
import { useCheckbox } from '../../../../context/CheckboxContext';
import { useAprendizFicha } from '../../../../context/AprendizFichaContext';

import { Box, Button, Stack } from '@mui/material';

import { buscarEmpresas } from '../../../../services/Empresa';

import InputField from '../../../FormFields/InputField';
import { TablaSelect } from '../../../Tabla/Tabla';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formEmpresaSearch } from '../../../../schemas/formEmpresa';

const FormSearchEmpresa = ({
  empresaSelecionada,
  handleEmpresaSeleccionado,
  handleMostrarCrearEmpresa,
}) => {
  //Estado para manejar la lista
  const [empresasEncontradas, setEmpresasEncontradas] = useState([]);

  const { selectedId, clearSelection } = useCheckbox();

  const { setEmpresaSeleccionada, idEmpresa } = useAprendizFicha();

  //Formulario de busqueda de empresass
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(formEmpresaSearch),
    defaultValues: {
      razonSocial: '',
      nit: '',
    },
  });

  const handleSearchEmpresas = async (searchData) => {
    try {
      const empresas = await buscarEmpresas(searchData);
      setEmpresasEncontradas(empresas);
    } catch (error) {
      console.error('Error al realizar la búsqueda de las empresas.', error);
    }
  };

  const selecionarEmpresa = async () => {
    if (!selectedId) return;
    //console.log('Seleccionando:', selectedId);
    setEmpresaSeleccionada(selectedId);
  };

  const onSubmit = (dataEmpresa) => {
    //console.log(dataEmpresa);
    handleSearchEmpresas(dataEmpresa);
  };
  useEffect(() => {
    if (idEmpresa) {
      console.log('idEmpresa actualizado:', idEmpresa);
    }
  }, [idEmpresa]);

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
            name="nit"
            label="Nit empresa"
            control={control}
            fullWidth
            sx={{
              flex: '2 1 50px', // se expande y colapsa, con mínimo 250px
              minWidth: '250px',
            }}
          />
          <InputField
            name="razonSocial"
            label="Nombre de la empresa"
            control={control}
            fullWidth
            sx={{
              flex: '6 1 50px', // más espacio proporcional
              minWidth: '300px',
            }}
          />
          <Box
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Box
              sx={{
                width: '100%', // Asegura que el contenedor del botón ocupe todo el ancho
                display: 'flex', // Usa flexbox para alinear el botón
                justifyContent: 'center', // Centra el botón
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  width: '100%', // Hace que el botón ocupe todo el ancho disponible
                  maxWidth: '200px', // Limita el ancho máximo del botón
                  height: '50px', // Ajusta la altura del botón
                }}
              >
                Buscar
              </Button>
            </Box>
          </Box>
        </Box>
      </form>

      <Box>
        <TablaSelect
          data={empresasEncontradas || []}
          dataException={['idEmpresa']}
          selectedValue={'idEmpresa'}
          header={[
            'Nit',
            'Razon social',
            'Telefono',
            'Correo Electrónico',
            'Dirección',
          ]}
        />
        <Stack direction='row' spacing={2} variant="outlined" sx={{ gap: '10px', justifyContent: 'space-between', mt: '24px' }}>
          <Button
            variant="contained"
            color='primary'
            disabled={!selectedId}
            onClick={() => {
              selecionarEmpresa();
              handleEmpresaSeleccionado(); // <-- activa que se seleccionó
              clearSelection();
            }}
            sx={{ margin: '2rem 0 1rem 0' }}
          >
            Seleccionar Empresa
          </Button>

          <Button
            variant="outlined"
            color='secondary'
            disabled={empresaSelecionada} // solo se puede crear si no hay una empresa seleccionada
            onClick={handleMostrarCrearEmpresa}
            sx={{ margin: '2rem 0 1rem 0' }}
          >
            Crear Empresa
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default FormSearchEmpresa;
