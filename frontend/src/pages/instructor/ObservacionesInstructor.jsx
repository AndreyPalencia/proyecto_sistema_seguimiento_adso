import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Typography, Box, IconButton, Divider, Tooltip } from '@mui/material';

import { useAprendicesByRuta } from '../../hook/useAprendicesByRuta';
import { useObservacionesAprendiz } from '../../hook/observaciones/useObservacionesAprendiz';

import Observacion from '../../components/Forms/FormObservacion/Observacion';
import NoDataComponent from '../../components/Tabla/NoDataComponent/NoDataComponet';
import FormCrearObservacion from '../../components/Forms/FormObservacion/FormCrearObservacion';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const ObservacionesInstructor = () => {
  const { idAprendiz } = useParams();
  
  const { aprendiz } = useAprendicesByRuta(idAprendiz);
    
  const [openCrear, setOpenCrear] = useState(false);

  const idFichaAprendiz = aprendiz?.idFichaAprendiz;

  const { observaciones, loading, refetchObservaciones } =
    useObservacionesAprendiz(idFichaAprendiz);

  const handleCloseCrear = () => setOpenCrear((prev) => !prev);

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
          <Tooltip title="Agregar un observación">
            <IconButton
              variant="contained"
              color="primary"
              onClick={handleCloseCrear} // define esta función según tu lógica
            >
              <AddOutlinedIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Box>
        <Divider sx={{ mb: 1, mt: -3 }} />

        {loading && <Typography>Cargando observaciones...</Typography>}

        {!loading && observaciones.length > 0 ? (
          [...observaciones].reverse().map((obs, index) => (
            <Box key={`${obs.idObservacion}-${index}`} sx={{ mb: 1 }}>
              <Observacion
                key={`observacion-${obs.idObservacion} `}
                idObservacion={obs.idObservacion}
                observacion={obs}
                refetchObservaciones={refetchObservaciones}
              />
            </Box>
          ))
        ) : !loading ? (
          <Box>
            <NoDataComponent />
          </Box>
        ) : null}
      </Box>
      {
        <FormCrearObservacion
          idFichaAprendiz={idFichaAprendiz}
          open={openCrear}
          onClose={handleCloseCrear}
          refetchObservaciones={refetchObservaciones}
        />
      }
    </>
  );
};

export default ObservacionesInstructor;
