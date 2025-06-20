import { Box, Typography } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const FullScreenLoader = ({ open, text = 'Procesando...' }) => (
  <Backdrop
    open={open}
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
  >
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress color="inherit" />
      {text && (
        <Box mt={2}>
          <Typography variant="h6" sx={{ color: '#fff' }}>
            {text}
          </Typography>
        </Box>
      )}
    </Box>
  </Backdrop>
);

export default FullScreenLoader;
