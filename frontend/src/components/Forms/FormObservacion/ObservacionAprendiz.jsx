import { Typography, Box } from '@mui/material';

const ObservacionAprendiz = ({ observacion }) => {
  const { fechaUltimaActualizacion: fecha, mostrarObservacion: mostrar } =
    observacion;

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
          <Box></Box>
        </Box>

        <Typography variant="body1">
          <span style={{ fontWeight: 'bold' }}>Observación:</span>{' '}
          {observacion.observacion}
        </Typography>
      </Box>
    </>
  );
};

export default ObservacionAprendiz;
