import { Box, Button } from '@mui/material';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formEmpresaSearch } from '../../../schemas/formEmpresa';
import InputField from '../../../components/FormFields/InputField';
import { buscarEmpresas } from '../../../services/Empresa';
import { useState } from 'react';
import { TablaSelect } from '../../Tabla/Tabla';
import { useCheckbox } from '../../../context/CheckboxContext';

import { modificarFichaAprendiz } from '../../../services/FichaAprendiz';

import { useAlert } from '../../../context/AlertContext';

const FormSearchEmpresa = ({
  onEmpresaActualizar,
  idFichaAprendiz,
  idEmpresa,
}) => {
  //Estado para manejar la lista
  const [empresasEncontradas, setEmpresasEncontradas] = useState([]);

  const { selectedId, clearSelection } = useCheckbox();

  const { showAlert } = useAlert();

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
      const empresas = await buscarEmpresas({ ...searchData, idEmpresa });
      setEmpresasEncontradas(empresas);
    } catch (error) {
      console.error('Error al realizar la búsqueda de las empresas.');
    }
  };

  const actualizarEmpresaAprendiz = async () => {
    if (!selectedId) return;
    const idEmpresa = selectedId;
    try {
      await modificarFichaAprendiz(idFichaAprendiz, {
        idEmpresa,
      });

      //console.log(aprendizFicha, idEmpresa , 'lOG DE FORM');
      onEmpresaActualizar(idEmpresa);
      clearSelection();
    } catch (error) {
      console.error('Error en actualizar la empresa.', error);
      showAlert({
        message: `Error al actualizar la información del aprediz respecto a la empresa: ${error.message}`,
        severity: 'error',
      });
    }
  };

  const onSubmit = (dataEmpresa) => {
    //console.log(dataEmpresa);
    handleSearchEmpresas(dataEmpresa);
  };

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

      {empresasEncontradas.length !== 0 && (
        <Box>
          <TablaSelect
            data={empresasEncontradas}
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
          <Button
            variant="contained"
            disabled={!selectedId}
            onClick={actualizarEmpresaAprendiz}
            sx={{ margin: '2rem 0 1rem 0' }}
          >
            Guardar cambios
          </Button>
        </Box>
      )}

      {/* {console.log(selectedId, 'Checkbox selecionado')} */}
    </>
  );
};

export default FormSearchEmpresa;
