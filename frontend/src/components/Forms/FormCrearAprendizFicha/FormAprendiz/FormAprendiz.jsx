import { useState } from 'react';
import { Box } from '@mui/material';
import { useAprendizFicha } from '../../../../context/AprendizFichaContext';
import FormCrearAprendiz from './FormCrearAprendiz';
import FormSearchAprendiz from './FormSearchAprendiz ';
import AprendizSeleccionadaInfo from './AprendizSeleccionadaInfo';

const FormAprendiz = () => {
  const [aprendizSeleccionado, setAprendizSeleccionado] = useState(false);
  const [mostrarCrearAprendiz, setMostrarCrearAprendiz] = useState(true);
  const { idAprendiz } = useAprendizFicha();

  const handleAprendizSeleccionado = () => {
    setAprendizSeleccionado((prev) => !prev);
    setMostrarCrearAprendiz(false); // Aseguramos que al seleccionar un aprendiz se oculte el formulario de creación
  };

  const handleMostrarCrearAprendiz = () => {
    setMostrarCrearAprendiz(true);
    setAprendizSeleccionado(false); // Aseguramos que al mostrar el formulario de creación no se considere un aprendiz seleccionado
  };

  const handleVolverBuscar = () => {
    setMostrarCrearAprendiz(false);
  };

  return (
    <Box sx={{ padding: '0 10px' }}>
      {idAprendiz ? (
        <AprendizSeleccionadaInfo
          handleVolverBuscar={handleVolverBuscar}
          handleAprendizSeleccionado={handleAprendizSeleccionado}
          handleMostrarCrearAprendiz={handleMostrarCrearAprendiz}
        />
      ) : mostrarCrearAprendiz ? (
        <FormCrearAprendiz handleVolverBuscar={handleVolverBuscar} />
      ) : (
        <FormSearchAprendiz
          aprendizSeleccionado={aprendizSeleccionado}
          handleMostrarCrearAprendiz={handleMostrarCrearAprendiz}
          handleAprendizSeleccionado={handleAprendizSeleccionado}
        />
      )}
    </Box>
  );
};

export default FormAprendiz;
