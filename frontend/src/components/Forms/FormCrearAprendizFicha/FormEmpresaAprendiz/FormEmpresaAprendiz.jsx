import { useState } from 'react';

import { Box } from '@mui/material';

import FormSearchEmpresa from './FormSearchEmpresa';
import FormCrearEmpresa from './FormCrearEmpresa';
import { useAprendizFicha } from '../../../../context/AprendizFichaContext';
import EmpresaSeleccionadaInfo from './EmpresaSeleccionadaInfo';

const FormEmpresaAprendiz = () => {
  const [seleccionarEmpresa, setSeleccionarEmpresa] = useState(false);
  const [crearEmpresa, setCrearEmpresa] = useState(false);

  const { idEmpresa } = useAprendizFicha(); // accede al contexto

  // const handleSeleccionarEmpresa = () => setSeleccionarEmpresa((prev) => !prev);
  // const handleCrearEmpresa = () => setCrearEmpresa((prev) => !prev);

  const handleEmpresaSeleccionado = () => {
    setSeleccionarEmpresa((prev) => !prev);
    setCrearEmpresa(false);
  };

  const handleMostrarCrearEmpresa = () => {
    setCrearEmpresa(true);
    setSeleccionarEmpresa(false);
  };

  const handleVolverBuscar = () => {
    setCrearEmpresa(false);
  };

  return (
    <Box sx={{ padding: '0 10px' }}>
      {idEmpresa ? (
        <EmpresaSeleccionadaInfo
          handleEmpresaSeleccionado={handleEmpresaSeleccionado}
          handleMostrarCrearEmpresa={handleMostrarCrearEmpresa}
        />
      ) : crearEmpresa ? (
        <FormCrearEmpresa handleVolverBuscar={handleVolverBuscar} />
      ) : (
        <FormSearchEmpresa
          seleccionarEmpresa={seleccionarEmpresa}
          handleEmpresaSeleccionado={handleEmpresaSeleccionado}
          handleMostrarCrearEmpresa={handleMostrarCrearEmpresa}
        />
      )}
    </Box>
  );
};

export default FormEmpresaAprendiz;
