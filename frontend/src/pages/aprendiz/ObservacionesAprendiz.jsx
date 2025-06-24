import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

import { Typography, Box, Divider, Tooltip, IconButton } from '@mui/material';

import { useObservacionesAprendiz } from '../../hook/observaciones/useObservacionesAprendiz';
import { useAprendizByRuta } from '../../hook/useAprendizByRuta';

import NoDataComponent from '../../components/Tabla/NoDataComponent/NoDataComponet';
import ObservacionAprendiz from '../../components/Forms/FormObservacion/ObservacionAprendiz';
import FormCrearObservacion from '../../components/Forms/FormObservacion/FormCrearObservacion';
import Observacion from '../../components/Forms/FormObservacion/Observacion';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const ObservacionesAprendiz = () => {
  const { roleUsuario } = useAuth();

  const { aprendizInfo } = useAprendizByRuta();

  const [openCrear, setOpenCrear] = useState(false);

  const isAdmin = roleUsuario === 'admin';

  const idFichaAprendiz = aprendizInfo?.idFichaAprendiz;

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
          {isAdmin && (
            <Tooltip title="Agregar un observación">
              <IconButton
                variant="contained"
                color="primary"
                onClick={handleCloseCrear} // define esta función según tu lógica
              >
                <AddOutlinedIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Divider sx={{ mb: 1, mt: -3 }} />

        {loading && <Typography>Cargando observaciones...</Typography>}

        {!loading && observaciones.length > 0 ? (
          [...observaciones].reverse().map((obs, index) => (
            <Box key={`${obs.idObservacion}-${index}`} sx={{ mb: 1 }}>
              {isAdmin ? (
                <Observacion
                  key={`observacion-${obs.idObservacion} `}
                  idObservacion={obs.idObservacion}
                  observacion={obs}
                  refetchObservaciones={refetchObservaciones}
                />
              ) : (
                <ObservacionAprendiz observacion={obs} />
              )}
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

export default ObservacionesAprendiz;
