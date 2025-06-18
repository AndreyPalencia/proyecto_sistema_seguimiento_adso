import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Typography, Box, Divider } from '@mui/material';

import { useObservacionesAprendiz } from '../../hook/observaciones/useObservacionesAprendiz';

import NoDataComponent from '../../components/Tabla/NoDataComponent/NoDataComponet';

import ObservacionAprendiz from '../../components/Forms/FormObservacion/ObservacionAprendiz';
import { useAprendizByRuta } from '../../hook/useAprendizByRuta';

const observacionesAprendiz = () => {
  const { aprendizInfo } = useAprendizByRuta();

  const idFichaAprendiz = aprendizInfo?.idFichaAprendiz;

  const { observaciones, loading, error } =
    useObservacionesAprendiz(idFichaAprendiz);

  return (
    <>
      <Box component="main" className="box-main-info" sx={{ marginBottom: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography
            component="h2"
            variant="h6"
            className="typography-title-info"
            fontSize="28px"
            fontWeight="bold"
          >
            Observaciones
          </Typography>

          {/* Aquí va el botón adicional */}
        </Box>
        <Divider sx={{ mb: 1, mt: -3 }} />

        {loading && <Typography>Cargando observaciones...</Typography>}

        {!loading && observaciones.length > 0 ? (
          [...observaciones].reverse().map((obs, index) => (
            <Box key={`${obs.idObservacion}-${index}`} sx={{ mb: 1 }}>
              <ObservacionAprendiz observacion={obs} />
            </Box>
          ))
        ) : !loading ? (
          <Box>
            <NoDataComponent />
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default observacionesAprendiz;
