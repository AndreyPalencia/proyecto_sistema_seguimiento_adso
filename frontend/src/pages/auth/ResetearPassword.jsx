import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlert } from '../../context/AlertContext';

import {
  Typography,
  DialogContent,
  Box,
  DialogTitle,
  Button,
  IconButton,
} from '@mui/material';

import Grid from '@mui/material/Grid2';
import KeyIcon from '@mui/icons-material/Key';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


import { resetearPassword } from '../../services/Auth';

import InputField from '../../components/FormFields/InputField';

import { formRecuperarPassword } from '../../schemas/formPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import CircularProgress from '@mui/material/CircularProgress';


const ResetearPassword = () => {
  const { token } = useParams();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const { showAlert } = useAlert();

  const navigate = useNavigate();

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(formRecuperarPassword),
  });

  const handleOnSumbit = (data) => {
    const { newPassword } = data;
    const formData = { newPassword, token };

    handleResetearPassword(formData);
  };

  const handleResetearPassword = async (formData) => {
    try {
      setLoading(true);
      const response = await resetearPassword(formData);
      if (!response.success) {
        showAlert({
          message: `Error no se puedo realizar el cambio de contraseña: ${response.error.message}`,
          variant: 'standard',
          severity: 'error',
        });
        return;
      }

      showAlert({
        message: 'Contraseña Cambiada Correctamente',
        variant: 'standard',
        severity: 'success',
      });
      navigate('/auth/login');
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      showAlert({
        message: `Error no se puedo realizar el cambio de contraseña : ${error.message}`,
        variant: 'standard',
        severity: 'error',
      });

      setLoading(false);
    }
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
          <form onSubmit={handleSubmit(handleOnSumbit)}>
            <Typography variant="h6" sx={{ color: 'black', margin: '15px' }}>
              Cambiar Contraseña
            </Typography>

            <Grid container spacing={4}>
              <Grid sx={{ width: '100%' }}>
                <InputField
                  name="newPassword"
                  label="Contraseña"
                  control={control}
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  size="small"
                  startIcon={<KeyIcon />}
                  endIcon={
                    <IconButton edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                  onClickIcon={() => setShowPassword(!showPassword)}
                />
              </Grid>

              <Grid sx={{ width: '100%' }}>
                <InputField
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  control={control}
                  type={showConfirmPassword ? 'text' : 'password'}
                  variant="outlined"
                  size="small"
                  startIcon={<KeyIcon />}
                  endIcon={
                    <IconButton edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  }
                  onClickIcon={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                />
              </Grid>

              <Grid sx={{ width: '100%' }}>
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
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

              <Grid sx={{ width: '100%' }}>
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
                    <ArrowBackIcon sx={{ mr: 1, fontSize: '20px' }} />
                    Volver al inicio
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

export default ResetearPassword;
