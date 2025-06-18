import { useEffect, useState } from 'react';
import { useCheckbox } from '../../../context/CheckboxContext';
import { useAprendizFicha } from '../../../context/AprendizFichaContext';

import { Box, Button, ButtonGroup, Stack } from '@mui/material';

import { buscarEmpresas } from '../../../services/Empresa';

import InputField from '../../FormFields/InputField';
import { TablaSelect } from '../../Tabla/Tabla';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formEmpresaSearch } from '../../../schemas/formEmpresa';

const FormSearchEmpreseSelect = ({
  handleEmpresaSeleccionada,
  selectedEmpresa,
}) => {
  const [empresasEncontradas, setEmpresasEncontradas] = useState([]);

  const { selectedId, clearSelection } = useCheckbox();
  const { setEmpresaSeleccionada, idEmpresa } = useAprendizFicha();

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

  const seleccionarEmpresa = async () => {
    // console.log(selectedId, 'emrpesa');
    if (!selectedId) return;
    setEmpresaSeleccionada(selectedId);
    clearSelection();
  };

  const onSubmit = (dataEmpresa) => {
    handleSearchEmpresas(dataEmpresa);
  };

  // useEffect(() => {
  //   if (idEmpresa) {
  //     console.log('idEmpresa actualizado:', idEmpresa);
  //   }
  // }, [idEmpresa]);

  useEffect(() => {
    clearSelection(); // Limpia selección previa
    setEmpresasEncontradas([]); // Opcional: limpiar tabla
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/**console.log('selectedId:', { selectedId }, Boolean(selectedId))*/}
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
            sx={{ flex: '2 1 50px', minWidth: '250px' }}
          />
          <InputField
            name="razonSocial"
            label="Nombre de la empresa"
            control={control}
            fullWidth
            sx={{ flex: '6 1 50px', minWidth: '300px' }}
          />
          <Box
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
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
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ pr: 2, mt: 2 }}
        >
          <Button
            variant="contained"
            disabled={!selectedId}
            onClick={() => {
              seleccionarEmpresa(); // opcional si quieres guardar globalmente
              handleEmpresaSeleccionada(selectedId); // ✅ enviar ID al padre
              clearSelection();
            }}
            sx={{ margin: '2rem 0 1rem 0' }}
          >
            Seleccionar Empresa
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default FormSearchEmpreseSelect;
