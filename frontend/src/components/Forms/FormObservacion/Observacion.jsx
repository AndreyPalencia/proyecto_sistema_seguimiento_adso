import { useEffect, useState } from 'react';
import { useAlert } from '../../../context/AlertContext';

import {
  Typography,
  Box,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip,
} from '@mui/material';

import { useEliminarObservacionAprendiz } from '../../../hook/observaciones/useEliminarObservacionAprendiz';
import { modificarEstadoObservacion } from '../../../services/Observaciones';

import FormEditarObservacion from './FormEditarObservacion';

import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const Observacion = ({
  idObservacion,
  observacion,
  refetchObservaciones,
}) => {

  const { fechaUltimaActualizacion: fecha, mostrarObservacion: mostrar } =
    observacion;

  const { fetchEliminarObservacion } = useEliminarObservacionAprendiz();

  const [valorObservacion, setValorObservacion] = useState(false);

  const [openEditar, setOpenEditar] = useState(false);

  const { showAlert } = useAlert();

  const eliminarObservacion = async (idObservacion) => {
    await fetchEliminarObservacion(idObservacion, refetchObservaciones);
  };

  const handleEstadoObservacion = async () => {
    const nuevoValor = !valorObservacion;
    setValorObservacion(nuevoValor);
    try {
      await modificarEstadoObservacion(idObservacion, nuevoValor);
      showAlert({
        message: 'Se actualizo el estado de la observacion.',
        variant: 'standard',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error al actualizar el estado de la observación:', error);
      showAlert({
        message: `Error al actualizar el estado de la observación ${error.message}`,
        severity: 'error',
      });
    }
  };

  const handleCloseEditar = () => setOpenEditar((prev) => !prev);

  useEffect(() => {
    setValorObservacion(Boolean(mostrar));
  }, [mostrar]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: ' 15px 25px 25px 25px ',
          border: '1px solid rgb(216, 210, 210)',
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Typography variant="h7" fontWeight="bold">
            Fecha de Última Observación: {fecha}
          </Typography>
          <Box>
            <Tooltip title="Visibilidad">
              <FormControlLabel
                control={
                  <Switch
                    size="medium"
                    checked={valorObservacion}
                    onChange={handleEstadoObservacion}
                    color="primary"
                  />
                }
              />
            </Tooltip>
            <Tooltip title="Editar Observación">
              <IconButton onClick={handleCloseEditar} color="secondary">
                <DrawOutlinedIcon sx={{ fontSize: 26 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar Observación">
              <IconButton
                onClick={() => eliminarObservacion(idObservacion)}
                color="error"
              >
                <DeleteOutlineOutlinedIcon sx={{ fontSize: 26 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography variant="body1">
          <span style={{ fontWeight: 'bold' }}>Observación:</span>{' '}
          {observacion.observacion}
        </Typography>
      </Box>
      <FormEditarObservacion
        idObservacion={idObservacion}
        open={openEditar}
        onClose={handleCloseEditar}
        observacion={{
          idObservacion,
          ...observacion,
        }}
        refetchObservaciones={refetchObservaciones}
      />
    </>
  );
};

export default Observacion;
