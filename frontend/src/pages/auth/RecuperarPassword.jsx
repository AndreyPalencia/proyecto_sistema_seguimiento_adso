import {
  Typography,
  DialogContent,
  Box,
  DialogTitle,
  Button,
} from '@mui/material';

import Grid from '@mui/material/Grid2';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useNavigate } from 'react-router-dom';

import useRecuperarPassword from '../../hook/auth/useRecuperarPassword';
import InputField from '../../components/FormFields/InputField';

import { zodResolver } from '@hookform/resolvers/zod';
import { set, useForm } from 'react-hook-form';
import formEmail from '../../schemas/formEmail';

import CircularProgress from '@mui/material/CircularProgress';

const RecuperarPassword = () => {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(formEmail),
  });

  const { recuperar, loading } = useRecuperarPassword();

  const onSubmit = async (data) => {
    await recuperar(data);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          justifyItems: 'center',
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box>
            <img
              src="/logoSena.png"
              style={{
                width: 180,
              }}
            />
          </Box>
        </DialogTitle>

        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" sx={{ color: 'black', margin: '15px' }}>
              Recuperar Contraseña
            </Typography>
            <Grid container spacing={4}>
              <Grid size={12}>
                <InputField
                  name="correoElectronico"
                  label="Correo Electrónico"
                  control={control}
                  type="email"
                  variant="outlined"
                  size="small"
                  startIcon={<AssignmentIndIcon />}
                />
              </Grid>

              <Grid size={12}>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  sx={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '10px 0',
                    fontSize: '16px',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: '#218838',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: '#fff', // Cambia el color del loader
                      }}
                    />
                  ) : (
                    'Enviar'
                  )}
                </Button>
              </Grid>

              <Grid size={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '100%',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'black',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        color: 'darkblue',
                      },
                    }}
                    onClick={() => navigate('/auth/login')}
                  >
                    <ArrowBackIcon sx={{ mr: 1, fontSize: '20px' }} /> Volver al
                    inicio
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Box>
    </>
  );
};
export default RecuperarPassword;
