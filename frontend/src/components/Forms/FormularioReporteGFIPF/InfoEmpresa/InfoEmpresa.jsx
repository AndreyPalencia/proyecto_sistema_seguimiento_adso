import { Box, Typography, TextField } from '@mui/material';

const InfoEmpresa = ({ empresa, infoFichaAprendiz }) => {
  if (!empresa || !infoFichaAprendiz) return null;

  return (
    <>
      <Typography
        component="h1"
        variant="h5"
        fontWeight="600"
        sx={{ margin: '20px 0 5px 0' }}
      >
        Información Empresa
      </Typography>

      <Box sx={{ display: 'flex', padding: '30px 0px', gap: '25px' }}>
        <Box sx={{ width: '600px' }}>
          <TextField
            label="Razón Social"
            value={empresa.razonSocial}
            fullWidth
            slotProps={{ readOnly: true }}
            disabled
          />
        </Box>
        <Box sx={{ width: '600px' }}>
          <TextField
            label="Nit de la Empresa"
            value={empresa.nit}
            fullWidth
            slotProps={{ readOnly: true }}
            disabled
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', padding: '30px 0px', gap: '25px' }}>
        <Box sx={{ width: '600px' }}>
          <TextField
            label="Dirección de la Empresa"
            value={empresa.direccion}
            fullWidth
            slotProps={{ readOnly: true }}
            disabled
          />
        </Box>
      </Box>

      <Typography
        component="h1"
        variant="h5"
        fontWeight="600"
        sx={{ margin: '20px 0 5px 0' }}
      >
        Información Jefe Inmediato
      </Typography>

      <Box sx={{ display: 'flex', padding: '30px 0px', gap: '25px' }}>
        <Box sx={{ width: '600px' }}>
          <TextField
            label="Jefe Inmediato"
            value={infoFichaAprendiz.jefeInmediato}
            fullWidth
            slotProps={{ readOnly: true }}
            disabled
          />
        </Box>
        <Box sx={{ width: '600px' }}>
          <TextField
            label="Cargo del Jefe"
            value={infoFichaAprendiz.cargoJefe}
            fullWidth
            slotProps={{ readOnly: true }}
            disabled
          />
        </Box>
        <Box sx={{ width: '600px' }}>
          <TextField
            label="mail del Jefe"
            value={infoFichaAprendiz.correoElectronicoJefe}
            fullWidth
            slotProps={{ readOnly: true }}
            disabled
          />
        </Box>
      </Box>
    </>
  );
};

export default InfoEmpresa;
