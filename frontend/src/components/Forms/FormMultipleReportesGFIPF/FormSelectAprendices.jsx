import { useEffect, useState } from 'react';
import { useCheckbox } from '../../../context/CheckboxContext';

import { Box, Button, Stack } from '@mui/material';

import { useAprendicesByEmpresa } from '../../../hook/fichaAprendiz/useAprendicesByEmpresa';

import { TablaSelect } from '../../Tabla/Tabla';

const FormSearchAprendiz = ({
  idEmpresa,
  idInstructor,
  onCloseFormulario,
  handleEmpresaSeleccionada,
  setIniciandoReportes,
}) => {
  const { selectedIds } = useCheckbox();

  const { loading, aprendicesEmpresa } = useAprendicesByEmpresa(
    idEmpresa,
    idInstructor
  );

  // useEffect(() => {
  //   console.log(
  //     { idEmpresa, idInstructor, aprendicesEmpresa, selectedIds },
  //     'Console'
  //   );
  // }, [idEmpresa, idInstructor, aprendicesEmpresa, selectedIds]);

  return (
    <>
      <Box>
        <TablaSelect
          data={aprendicesEmpresa || []}
          dataException={['idUsuario', 'idFichaAprendiz']}
          selectedValue={'idFichaAprendiz'}
          header={['Tipo documento', 'Numero documento', 'Nombre', 'Apellido']}
          multiSelect={true}
        />
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ pr: 2, mt: 2 }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              handleEmpresaSeleccionada();
            }}
          >
            Volver a empresas
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              onCloseFormulario();
            }}
          >
            Cerrar
          </Button>

          <Button
            variant="contained"
            color="primary"
            disabled={selectedIds.length === 0}
            onClick={() => {
              setIniciandoReportes(true);
            }}
          >
            Generar Reportes
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default FormSearchAprendiz;
