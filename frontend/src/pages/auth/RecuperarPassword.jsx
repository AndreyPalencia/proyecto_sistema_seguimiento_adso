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
import { useAlert } from '../../context/AlertContext';

import { recuperarPassword } from '../../services/Auth';
import InputField from '../../components/FormFields/InputField';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import formEmail from '../../schemas/formEmail';

const RecuperarPassword = () => {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(formEmail),
  });

  const { showAlert } = useAlert();

  const handleRecuperar = async (formData) => {
    try {
      const response = await recuperarPassword(formData);
      if (!response.success) {
        showAlert({
          message: 'No se puedo enviar el correo de recuperacion.',
          variant: 'standard',
          severity: 'warning',
        });
        return;
      }
      showAlert({
        message: 'Correo de recuperacion enviado.',
        variant: 'standard',
        severity: 'success',
      });
      navigate('/auth/login');
    } catch (error) {
      console.error('Error al recuperar la contraseña:', error);
      showAlert({
        message: `Error al enviar el correo de recuperacion: ${error}`,
        variant: 'standard',
        severity: 'warning',
      });
    }
  };

  const onSubmit = (data) => {
    handleRecuperar(data);
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
                  Enviar
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
