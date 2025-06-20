import { useAprendizFicha } from '../../../../context/AprendizFichaContext';
import FormUsuario from '../../FormUsuarios/FormUsuario'; // adjust path if needed
import { Button, Stack } from '@mui/material';

const FormCrearAprendiz = ({ handleVolverBuscar }) => {
  const { setAprendiz } = useAprendizFicha();

  const onSuccess = (idUsuario) => {
    setAprendiz(idUsuario);
  };

  return (
    <>
      <FormUsuario rolDefault="aprendiz" onSuccess={onSuccess}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleVolverBuscar}
          sx={{ margin: '0' }}
        >
          Buscar Aprendiz
        </Button>
      </FormUsuario>
    </>
  );
};

export default FormCrearAprendiz;
